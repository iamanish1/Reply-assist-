import { Platform } from 'react-native';

export const fontFamilies = {
  regular: Platform.select({ android: 'Roboto', ios: 'System', default: 'System' }),
  medium: Platform.select({ android: 'Roboto', ios: 'System', default: 'System' }),
  semibold: Platform.select({ android: 'Roboto', ios: 'System', default: 'System' }),
};

export const fontSizes = {
  h1: 26,
  h2: 20,
  h3: 16,
  body: 15,
  small: 13,
  tiny: 12,
};

export const lineHeights = {
  h1: 32,
  h2: 26,
  h3: 22,
  body: 22,
  small: 18,
  tiny: 16,
};


