import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/500.css';
import '@fontsource/noto-sans/600.css';
import '@fontsource/noto-sans/700.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from 'src/modules/auth/hooks';
import { Navbar, Redirects } from 'src/components';
import { theme, configureAxios } from '../config';
import '../styles/globals.css';

const queryClient = new QueryClient();
configureAxios();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Navbar />
          <Redirects />
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
