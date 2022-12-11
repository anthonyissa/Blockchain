import { useEffect, useState } from "react";
import { Block } from "../blockchain/Model/Block";
import { Blockchain } from "../blockchain/Model/Blockchain";
import { Transaction } from "../blockchain/Model/Transaction";
import { TransactionData } from "../blockchain/Model/TransactionData";

const Blockview = (props:{block:Block, blockchain:Blockchain, setBlock:Function}) => {

    const [valid, setValid] = useState(false);
    const [mining, setMining] = useState(false);

    useEffect(()=>{
        setValid(props.block.status == "PENDING");
    })

    function checkBlock(){
        props.blockchain.checkBlock(props.block);
        if(props.block.status == "PENDING") setValid(true);
    }
 
    function mineBlock(){
        setMining(true);
        setTimeout(()=>{
            props.blockchain.mineBlock(props.block, "Alice").then((data)=>{
                setMining(false);
                props.setBlock(new Block(new Date().getTime(), []));
            });
        }, 1000)
    }

    return (
        <div className="bg-indigo-100 p-3 rounded-lg mt-5">
            <h1 className="font-bold text-xl">Current Block {(valid && <span className="text-green-500">VALID</span>)} {(!valid && <span className="text-red-500">INVALID</span>)} 
                <button className='button ml-3' onClick={checkBlock}>Validate Block</button>
                <button className='button ml-3' onClick={mineBlock}>Mine Block</button>
                {(mining && <span className="ml-3">MINING...</span>)}
            </h1>
            {
            props.block.transactions.map((transaction:Transaction, index:number) => {
              return <div key={index}>
                <p><span className="font-bold">Tx {index} </span>Spender : {transaction.address} | <span className="text-sm italic">Tx hash : {transaction.hash}</span> </p>
                {
                    transaction.transactionData.map((data:TransactionData, index2) => {
                        return <p key={index2}>{data.type} : {data.address} ➡ {data.amount}</p>
                    })
                }
              </div>;
            })
          }
        </div>
    );
}

export default Blockview;