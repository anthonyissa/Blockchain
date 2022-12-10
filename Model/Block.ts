import { Transaction } from "./Transaction";
import sha256 from 'crypto-js/sha256';

export class Block{

    index: number;
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(timestamp:number, transactions:Transaction[], previousHash:string = "0x", index:number = 0){
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash():string{
        return sha256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions)).toString();
    }

}