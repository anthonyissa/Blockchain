import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { Blockchain } from "../blockchain/Model/Blockchain";

const BlockchainView = (props:{blockchain:Blockchain}) => {

    const router = useRouter();

    function viewBlock(index:number){
        router.push("/block/"+index);
    }

    return (
        <div className="bg-indigo-100 p-3 rounded-lg mt-5">
            <h1 className="font-bold text-xl">Blockchain : </h1>
            {
                props.blockchain.chain.map((block, index) => {
                    return <div key={index} className="cursor-pointer hover:text-indigo-500" onClick={() => viewBlock(index)}>
                        <h1>Block #{block.index} | {block.hash}</h1>
                    </div>
                })
            }
        </div>
    );
}

export default BlockchainView;