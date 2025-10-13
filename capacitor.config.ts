import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.baphomet.collinlucke.com',
  appName: 'Baphomet',
  webDir: 'dist',
  server: {
    allowNavigation: ['http://10.0.2.2:5050'],
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
