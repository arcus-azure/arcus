import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import 'modern-normalize';
import '../prism/theme.css';
import GlobalStyle from '../config/theme/global';
import { theme } from '../config/theme';
import Layout from '../components/Layout';
import React from 'react';
import { ComponentMatter, PageMatter } from '../types';

type Props = {
  pages?: PageMatter[];
  components?: ComponentMatter[];
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <meta name="robots" content="index, follow" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#249CFF" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <main>
          <Layout pages={(pageProps as Props).pages} components={(pageProps as Props).components}>
            <Component {...pageProps} />
          </Layout>
        </main>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default MyApp;
