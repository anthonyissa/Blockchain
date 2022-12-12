import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';
import { Blockchain } from '../blockchain/Model/Blockchain';
import { initServer } from '../blockchain/Server/Server';

export default function App({ Component, pageProps }: AppProps) {

  
  const [blockchain, setBlockchain] = useState<Blockchain | null>(null);

  useEffect(()=>{
    setBlockchain(initServer())
  }, [])

  return blockchain && <Component {...pageProps} blockchain={blockchain}/>
}
