import {
  extendTheme,
  ThemeConfig,
  withDefaultColorScheme
} from '@chakra-ui/react';
import '@fontsource/noto-sans/500.css';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

export const theme = extendTheme(
  {
    colors: {
      brandLight: '#E0E0E0',
      brandLightGray: '#BDBDBD',
      brandGray: '#828282',
      brandDark: '#333333'
    },
    fonts: {
      body: 'Noto sans, sans-serif',
      heading: 'Noto sans, sans-serif'
    },
    breakpoints: {
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1920px'
    },
    config
  },
  withDefaultColorScheme({
    colorScheme: 'blue',
    components: ['Button']
  })
);
