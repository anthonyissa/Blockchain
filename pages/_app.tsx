import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { Blockchain } from '../blockchain/Model/Blockchain';
import { initServer } from '../blockchain/Server/Server';

export default function App({ Component, pageProps }: AppProps) {


  const [blockchain, setBlockchain] = useState<Blockchain | null>(null);

  useEffect(() => {
    setBlockchain(initServer())
  }, [])

  return (
    <div>
      <Head>
        <title>Blockchain Simulator</title>
        <link rel="icon" href="/blockchain.ico" />
      </Head>
      {(blockchain && <Component {...pageProps} blockchain={blockchain} />)}

    </div>
  )
}
