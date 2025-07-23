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

export const logEnvironmentInfo = () => {
  if (isDevelopment()) {
    console.log('🎭 Environment Info:');
    console.log(`   Mode: ${import.meta.env.MODE}`);
    console.log(`   PhantomArtist: ${getPhantomArtistSource()}`);
    console.log(`   Dev Mode: ${isDevelopment()}`);
  }
};
