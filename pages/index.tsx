import { useEffect, useState } from 'react'
import { Blockchain } from '../blockchain/Model/Blockchain';
import { Block } from '../blockchain/Model/Block'
import styles from '../styles/Home.module.css'
import Blockview from '../components/Block';
import BlockchainView from '../components/BlockchainView';


export default function Home(props:{blockchain:Blockchain}) {

  const [blockchain, setBlockchain] = useState<Blockchain | null>(props.blockchain);
  const [user, setUser] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number | undefined>(0);
  const [balanceVisible, setBalanceVisible] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<number>(0.0);
  const [block, setBlock] = useState<Block | null>(new Block(new Date().getTime(), []))

  useEffect(()=>{}, [block, blockchain])

  function handleChangeUser(user:string){
    setUser(user);
    setBalanceVisible(false);
  }
  function handleChangeFrom(user:string){
    setFrom(user);
  }
  function handleChangeTo(user:string){
    setTo(user);
  }
  function handleChangeAmount(amount:string){
    setAmount(parseFloat(amount));
  }

  function getBalance(){
    if(user.replaceAll(" ", "")=="") return;
    setUserBalance(blockchain?.getBalance(user));
    setBalanceVisible(true);
    setTimeout(()=>setBalanceVisible(false), 5000);
  }
  function addTransaction(){
    if(from && to && amount && blockchain && block) {
      block?.addTransaction(from, to, amount, blockchain);
      setBlock(new Block(block.timestamp, [...block.transactions]))
      setFrom("");
      setTo("");
    }
  }

  return (
    <div className={styles.container}>

      <main>
        <div className=' bg-gray-100 rounded-lg p-5 w-11/12 mx-auto mt-5 drop-shadow-xl'>
        <div className='flex items-center'>
            <input className='input drop-shadow-md' value={user} type="text" placeholder='Address (e.g Alice)' onChange={(e) => handleChangeUser(e.target.value)}/>
            <button className='button drop-shadow-md' onClick={getBalance}>Get Balance</button>
            <p className='ml-10'>{(balanceVisible && <span>{user}'s Balance : {userBalance}</span>)}</p>
          </div>
          <div className='flex items-center mt-5'>
            <input className='input drop-shadow-md' value={from} type="text" placeholder='From' onChange={(e) => handleChangeFrom(e.target.value)}/>
            <input className='input drop-shadow-md' value={to} type="text" placeholder='To' onChange={(e) => handleChangeTo(e.target.value)}/>
            <input className='input drop-shadow-md' placeholder='Amount' onChange={(e) => handleChangeAmount(e.target.value)}/>
            <button className='button drop-shadow-md' onClick={addTransaction}>Add Transaction</button>
          </div>
          {(block && blockchain && block.transactions && block.transactions.length != 0 &&
            <Blockview setBlock={setBlock} block={block} blockchain={blockchain}/>
          )}
          {(blockchain && 
            <BlockchainView blockchain={blockchain} />  
          )}
        </div>
      </main>

    </div>
  )
}
