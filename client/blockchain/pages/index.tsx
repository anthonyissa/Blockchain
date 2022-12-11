import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Blockchain } from '../blockchain/Model/Blockchain';
import { initServer } from '../blockchain/Server/Server'
import styles from '../styles/Home.module.css'


export default function Home() {

  const [blockchain, setBlockchain] = useState<Blockchain | null>(null);


  useEffect(()=>{
    setBlockchain(initServer());
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <input className='input' type="text" />
          <button className='button'>Get Balance</button>
        </div>
      </main>

    </div>
  )
}
