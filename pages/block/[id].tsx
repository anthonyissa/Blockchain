import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Block } from '../../blockchain/Model/Block';
import { Blockchain } from '../../blockchain/Model/Blockchain';

export default function About(props: { blockchain: Blockchain }) {

  const [block, setBlock] = useState<Block | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (props.blockchain.chain.length <= parseInt(id as string)) router.push("/")
    else setBlock(props.blockchain.chain[parseInt(id as string)])

  })

  return <div className='bg-gray-100 rounded-lg p-5 w-11/12 mx-auto mt-5 drop-shadow-xl'>
    <h1 className='font-bold text-4xl mb-1 text-indigo-500'>Block #{block?.index} <span className='text-base font-normal italic'>{block?.hash}</span></h1>
    {
      (block?.index != 0 && <div className='text-lg'>
        <p className='underline cursor-pointer hover:text-indigo-500' onClick={() => router.push("/block/" + (block!.index - 1))}>Previous block : {block?.previousHash}</p>
        <p>Mined by : {block?.miner}</p>
        <p>Nonce : {block?.nonce}</p>
        <p>Nb transactions : {block?.transactions.length}</p>
      </div>)
    }
    {
      block?.transactions.map((transaction, index) => {
        return (
          <div key={index} className="border-b py-5">
            <p className='text-lg mb-1'>Tx {index} | {transaction.hash}</p>
            <div className='flex w-full'>
              <div className='w-6/12 border-r border-indigo-500'>
                {
                  transaction.transactionData.filter(data => data.type == "IN").map((data, index) => {
                    return (
                      <div className='ml-10' key={index}>
                        <p><span className='font-bold'>{data.type}</span> {data.amount} ➡ {data.address}</p>
                      </div>
                    )
                  })
                }
              </div>
              <div className='w-6/12'>
                {
                  transaction.transactionData.filter(data => data.type == "OUT").map((data, index) => {
                    return (
                      <div className='ml-10' key={index}>
                        <p><span className='font-bold'>{data.type}</span> {data.amount} ➡ {data.address}</p>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        )
      })
    }
  </div>
}
