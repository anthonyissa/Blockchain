import { useEffect, useState } from "react";
import { Block } from "../blockchain/Model/Block";
import { Blockchain } from "../blockchain/Model/Blockchain";
import { Transaction } from "../blockchain/Model/Transaction";
import { TransactionData } from "../blockchain/Model/TransactionData";

const Blockview = (props: { block: Block, blockchain: Blockchain, setBlock: Function }) => {

    const [valid, setValid] = useState(false);
    const [mining, setMining] = useState(false);

    useEffect(() => {
        setValid(props.block.status == "PENDING");
    })

    function checkBlock() {
        props.blockchain.checkBlock(props.block);
        if (props.block.status == "PENDING") setValid(true);
    }

    function mineBlock() {
        setMining(true);
        setTimeout(() => {
            props.blockchain.mineBlock(props.block, "Alice").then((data) => {
                setMining(false);
                deleteBlock();
            });
        }, 1000)
    }

    function deleteBlock() {
        props.setBlock(new Block(new Date().getTime(), []));
    }

    return (
        <div className="bg-indigo-100 p-3 rounded-lg mt-5">
            <h1 className="font-bold text-xl flex items-center">New Block {(valid && <span className="text-green-500 ml-3">VALID</span>)} {(!valid && <span className="text-red-500 ml-3">INVALID</span>)}
                {!valid && (<button className='button ml-3' onClick={checkBlock}>Validate Block</button>)}
                {valid && (<button className='button ml-3' onClick={mineBlock}>Mine Block</button>)}
                <button className='button ml-3 h-10' onClick={deleteBlock}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                </button>
                {(mining && <span className="ml-3">MINING...</span>)}
            </h1>
            {
                props.block.transactions.map((transaction: Transaction, index: number) => {
                    return <div key={index}>
                        <p><span className="font-bold">Tx {index} </span>Spender : {transaction.address} | <span className="text-sm italic">Tx hash : {transaction.hash}</span> </p>
                        {
                            transaction.transactionData.map((data: TransactionData, index2) => {
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