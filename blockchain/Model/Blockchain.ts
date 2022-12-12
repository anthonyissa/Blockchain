import { Block, GenesisBlock } from "./Block";
import sha256 from 'crypto-js/sha256';
import { Transaction } from "./Transaction";
import { BlockStatusEnum, TransactionTypeEnum } from "./Enum/enums";
import { TransactionData } from "./TransactionData";
import { resolve } from "path";

export class Blockchain{

    chain:Block[];
    reward: number = 6.25;

    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    /**
     * Create genesis block with some minted coins
     * @returns Genesis Block
     */
    createGenesisBlock():Block{
        const transactionData = new TransactionData("COINBASE", TransactionTypeEnum.IN, 2);
        const transactionData2 = new TransactionData("Alice", TransactionTypeEnum.OUT, 1);
        const transactionData3 = new TransactionData("Bob", TransactionTypeEnum.OUT, 1);
        const transactionData4 = new TransactionData("COINBASE", TransactionTypeEnum.OUT, 0);
        const transaction = new Transaction("Bob", [transactionData, transactionData2, transactionData3, transactionData4])
        return new GenesisBlock(new Date().getTime(), [transaction], "0x");
    }

    /**
     * Mine a new block to add it to the blockchain
     * @param newBlock Block you wish to mine
     * @param miner Miner trying to mine
     * @returns Promise true if block is mined
     */
    mineBlock(newBlock:Block, miner:string):Promise<boolean>{
        return new Promise(resolve => {
            if(newBlock.status != BlockStatusEnum.PENDING) {
                resolve(false); 
                return false;
            }
            let nonce:number = 0;
            const lastBlock:Block = this.getLastBlock();
            newBlock.addMintTransaction(miner, this.reward);
            while(true){
                const newHash:string = sha256(newBlock.hash + nonce).toString();
                if(newHash.startsWith("0000")){ 
                    newBlock.minedTimestamp = new Date().getTime();
                    newBlock.hash = newHash;
                    newBlock.nonce = nonce;
                    newBlock.previousHash = lastBlock.hash;
                    newBlock.index = lastBlock.index + 1;
                    newBlock.status = BlockStatusEnum.MINED;
                    break;
                } 
                nonce++;
            }
            this.chain.push(newBlock);
           resolve(true);
        });
    }

    /**
     * Get last block mined
     * @returns last block mined
     */
    getLastBlock():Block{
        return this.chain[this.chain.length - 1];
    }

    /**
     * Get the balance of a specific user
     * @param user User you wish to check the balance of
     * @returns User's balance
     */
    getBalance(user: string):number{
        let currentBlock:Block;
        let currentTransaction:Transaction;
        let balance: number = 0;
        for(let i = this.chain.length-1; i>=0; i--){
            currentBlock = this.chain[i];
            for(let j = currentBlock.transactions.length-1; j>=0; j--){
                currentTransaction = currentBlock.transactions[j];
                balance += currentTransaction.getAllReceivedOf(user);
            }
            if(currentBlock.hasUserSpentInThisBlock(user)) break;
        }
        return balance;
    }

    /**
     * Checks specific block to mark it as pending
     * @param block Block you wish to check
     * @returns True if block is valid
     */
    checkBlock(block:Block):boolean{
        return block.validateBlock(this);
    }
}