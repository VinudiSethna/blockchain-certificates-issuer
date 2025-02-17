import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import RootLayout from './layout';
import EthProvider from '../contexts/EthContext/EthProvider';

export default function CustomApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout || ((page) => <RootLayout>{page}</RootLayout>);

  return getLayout(<EthProvider><Component {...pageProps} /></EthProvider>);
}
