import { MD3LightTheme as DefaultTheme, configureFonts, MD3Theme } from 'react-native-paper';
import { Platform } from 'react-native';

// Color palette
const primary = '#006985';
const secondary = '#00A0BD';
const tertiary = '#005E72';
const error = '#B3261E';
const background = '#F7FAFC';
const surface = '#FFFFFF';

// Font config
const fontConfig = {
  default: {
    regular: {
      fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
      fontWeight: '100' as const,
    },
  },
};

export const theme: MD3Theme = {
  ...DefaultTheme,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primary,
    secondary,
    tertiary,
    error,
    background,
    surface,
  },
  // Cast to satisfy MD3Theme fonts typing
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fonts: configureFonts({ config: fontConfig }),
}; 