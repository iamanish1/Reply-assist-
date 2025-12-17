import { Platform } from 'react-native';

export const shadows = {
  card: Platform.select({
    android: { elevation: 2 },
    ios: {
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    default: {},
  }),
};


