import { TransactionData } from "./TransactionData";
import sha256 from 'crypto-js/sha256';
import { TransactionTypeEnum } from "./Enum/enums";

export class Transaction{

    hash: string;
    address: string;
    transactionData: TransactionData[];
    
    constructor(address:string, transactionData:TransactionData[]){
        this.address = address;
        this.transactionData = transactionData;
        this.hash = this.calculateHash();
    }
    
    calculateHash(){
        return sha256(this.address + this.hash + this.transactionData).toString();
    }

    getConcernedOutTransactionDataAmount():number{
        let currentTransactionData:TransactionData;
        for(let i = this.transactionData.length-1; i>=0; i--){
            currentTransactionData = this.transactionData[i];
            if(currentTransactionData.address == this.address && currentTransactionData.type == TransactionTypeEnum.OUT)
                return currentTransactionData.amount;
        }
        return 0;
    }
}