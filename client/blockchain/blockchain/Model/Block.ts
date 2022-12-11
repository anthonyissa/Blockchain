import { Transaction } from "./Transaction";
import sha256 from 'crypto-js/sha256';
import { BlockStatusEnum, TransactionTypeEnum } from "./Enum/enums";
import { Blockchain } from "./Blockchain";
import { TransactionData } from "./TransactionData";

export class Block{

    /* TODO: readonly*/ index: number;
    timestamp: number;
    minedTimestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;
    miner: string;
    status: BlockStatusEnum;

    constructor(timestamp:number, transactions:Transaction[], previousHash:string = "0x", index:number = 0){
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.status = BlockStatusEnum.NEW;
        this.hash = this.calculateHash();
    }

    /**
     * Get block's hash
     * @returns Block's hash
     */
    calculateHash():string{
        return sha256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions)).toString();
    }

    /**
     * Validates a block if each transactions IN and OUT are valid and if block doesn't contain minted coins
     * @param blockchain The current blockchain you're working on
     * @returns True if transactions are valid
     */
    validateBlock(blockchain:Blockchain):boolean{
        if(this.status != BlockStatusEnum.NEW) return false;
        for(const transaction of this.transactions) {
            if(transaction.address == "COINBASE") return false; // COINBASE -> MINT
            else if(!transaction.areInAndOutValid(blockchain)) return false; 
            
        }
        this.status = BlockStatusEnum.PENDING;
        return true;
    }

    /**
     * Mint coins to reward the miner
     * @param miner Miner who should be rewarded for the mining process
     * @param reward Reward given to the miner
     * @returns True if block is pending and everything went through
     */
    addMintTransaction(miner:string, reward:number):boolean{
        if(this.status != BlockStatusEnum.PENDING) return false;
        this.miner = miner;
        this.transactions.push(new Transaction("COINBASE",  [new TransactionData("COINBASE", TransactionTypeEnum.IN, reward), new TransactionData(miner, TransactionTypeEnum.OUT, reward),  new TransactionData("COINBASE", TransactionTypeEnum.OUT, 0)]));
        return true;
    }

    /**
     * Check if user has spent coins in one of this block's transactions
     * @param user User you wish to check
     * @returns True if user spent in this block
     */
    hasUserSpentInThisBlock(user:string):boolean{
        return this.transactions.find((transaction) => transaction.address == user) ? true : false;
    }
    
    /** TODO: temp function
     * Add a new transaction to the block
     * @param from User from which the amount is sent
     * @param to User to which the amount is sent
     * @param amount Amount to send
     * @param blockchain The current blockchain you're working on
     */
    addTransaction(from:string, to:string, amount:number, blockchain:Blockchain){
        this.status = BlockStatusEnum.NEW;
        this.transactions.push(new Transaction(from,
            [
                new TransactionData(from, TransactionTypeEnum.IN, blockchain.getBalance(from)),
                new TransactionData(from, TransactionTypeEnum.OUT, blockchain.getBalance(from)-amount),
                new TransactionData(to, TransactionTypeEnum.OUT, amount)
            ]));
    }

}

export class GenesisBlock extends Block{

    constructor(timestamp:number, transactions:Transaction[], previousHash:string = "0x", index:number = 0){
        super(timestamp, transactions, previousHash, index);
        this.status = BlockStatusEnum.MINED;
    }

}