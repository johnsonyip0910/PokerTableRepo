import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.poker.table',
  appName: 'PokerTable',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
