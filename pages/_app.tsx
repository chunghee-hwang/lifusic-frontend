import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { GlobalStyle } from '@/styles/global-style';
import Head from 'next/head';
import Header from '@/components/Header';
import { StompContextProvider } from '@/contexts/StompContext';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <StompContextProvider>
          <GlobalStyle />
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Lifusic</title>
          </Head>
          <Header />
          <Component {...pageProps} />
        </StompContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
