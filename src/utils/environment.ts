/**
 * Environment utilities for baphomet-ui
 */

export const isDevelopment = () => {
  return import.meta.env.MODE === 'development' || __DEV_MODE__;
};

export const isProduction = () => {
  return import.meta.env.MODE === 'production' && !__DEV_MODE__;
};

export const isUsingLocalPhantomArtist = () => {
  return (
    __USE_LOCAL_PHANTOMARTIST__ ||
    import.meta.env.VITE_USE_LOCAL_PHANTOMARTIST === 'true'
  );
};

export const getPhantomArtistSource = () => {
  return isUsingLocalPhantomArtist() ? 'local' : 'production';
};

export const getGraphQLEndpoint = () => {
  // Check if running in Capacitor (mobile app)
  const isCapacitor =
    window.location.protocol === 'capacitor:' ||
    !!(
      window as typeof window & { Capacitor?: { isNativePlatform?(): boolean } }
    ).Capacitor?.isNativePlatform?.();

  // Debug logging
  // console.log('Environment Debug:', {
  //   protocol: window.location.protocol,
  //   hostname: window.location.hostname,
  //   isCapacitor,
  //   isDev: isDevelopment(),
  //   mode: import.meta.env.MODE,
  //   androidEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT_ANDROID,
  //   isNetworkAccess: window.location.hostname !== 'localhost' &&
  //                    window.location.hostname !== '127.0.0.1' &&
  //                    window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)
  // });

  // Add debug alert for mobile
  if (isCapacitor) {
    alert(
      `Debug: Detected Capacitor! Protocol: ${
        window.location.protocol
      }, AndroidEndpoint: ${import.meta.env.VITE_GRAPHQL_ENDPOINT_ANDROID}`
    );
  }

  // PRIORITY 1: If running in Capacitor/Android, always use the Android endpoint for local development
  if (isCapacitor) {
    const androidEndpoint =
      import.meta.env.VITE_GRAPHQL_ENDPOINT_ANDROID ||
      'http://10.0.2.2:5050/graphql';
    console.log('Using Android endpoint:', androidEndpoint);
    return androidEndpoint;
  }

  // PRIORITY 2: Check if accessing via network IP (phone browser)
  const isNetworkAccess =
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/);

  if (isNetworkAccess && isDevelopment()) {
    const networkEndpoint = `http://${window.location.hostname}:5050/graphql`;
    console.log(
      'Using network IP endpoint for mobile browser:',
      networkEndpoint
    );
    return networkEndpoint;
  }

  // PRIORITY 3: Regular web development
  if (isDevelopment()) {
    console.log('Using localhost endpoint for web development');
    return 'http://localhost:5050/graphql';
  }

  // PRIORITY 4: Production fallback
  const prodEndpoint =
    import.meta.env.VITE_GRAPHQL_ENDPOINT ||
    'https://baphomet-server.onrender.com/graphql';
  console.log('Using production endpoint:', prodEndpoint);
  return prodEndpoint;
};

export const logEnvironmentInfo = () => {
  if (isDevelopment()) {
    console.log('🎭 Environment Info:');
    console.log(`   Mode: ${import.meta.env.MODE}`);
    console.log(`   PhantomArtist: ${getPhantomArtistSource()}`);
    console.log(`   GraphQL Endpoint: ${getGraphQLEndpoint()}`);
    console.log(`   Dev Mode: ${isDevelopment()}`);
  }
};
