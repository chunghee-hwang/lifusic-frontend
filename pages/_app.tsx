import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { GlobalStyle } from '@/styles/global-style';
import Head from 'next/head';
import Header from '@/components/Header';
import { StompContextProvider } from '@/contexts/StompContext';
import { useRouter } from 'next/router';
import { MusicPlaylistContextProvider } from '@/contexts/MusicPlaylistContext';
import { MusicPlayerContextProvider } from '@/contexts/MusicPlayerContext';
import { SnackbarProvider } from 'notistack';
export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  let children;
  const component = <Component {...pageProps} />;
  if (router.pathname.startsWith('/management')) {
    children = <StompContextProvider>{component}</StompContextProvider>;
  } else if (router.pathname.startsWith('/service')) {
    children = (
      <MusicPlaylistContextProvider>
        <MusicPlayerContextProvider>{component}</MusicPlayerContextProvider>
      </MusicPlaylistContextProvider>
    );
  } else {
    children = component;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Lifusic</title>
      </Head>
      <AuthContextProvider>
        <SnackbarProvider>
          <Header />
          {children}
        </SnackbarProvider>
      </AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
