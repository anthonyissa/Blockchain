import { Block } from "./Block";
import sha256 from 'crypto-js/sha256';
import { Transaction } from "./Transaction";

export class Blockchain{

    chain:Block[];

    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock():Block{
        return new Block(new Date().getTime(), [], "0x");
    }

    mineBlock(newBlock:Block):boolean{
        let nonce:number = 0;
        const lastBlock:Block = this.getLastBlock();
        while(true){
            const newHash:string = sha256(newBlock.hash + nonce).toString();
            if(newHash.startsWith("0000")){ 
                newBlock.hash = newHash;
                newBlock.nonce = nonce;
                newBlock.previousHash = lastBlock.hash;
                newBlock.index = lastBlock.index + 1;
                break;
            }
            nonce++;
        }
        this.chain.push(newBlock);
        return true;
    }

    getLastBlock():Block{
        return this.chain[this.chain.length - 1];
    }

    getBalance(address: string):number{
        let currentBlock:Block;
        let currentTransaction:Transaction;
        for(let i = this.chain.length-1; i>=0; i--){
            currentBlock = this.chain[i];
            for(let j = currentBlock.transactions.length-1; j>=0; j--){
                currentTransaction = currentBlock.transactions[j];
                if(currentTransaction.address == address){
                    return currentTransaction.getConcernedOutTransactionDataAmount();
                }
            }
        }
        return 0;
    }
}