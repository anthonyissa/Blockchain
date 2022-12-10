import { Block } from "./Block";
import sha256 from 'crypto-js/sha256';

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
}