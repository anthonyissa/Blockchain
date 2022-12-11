import { TransactionData } from "./TransactionData";
import sha256 from 'crypto-js/sha256';
import { TransactionTypeEnum } from "./Enum/enums";
import { Blockchain } from "./Blockchain";

export class Transaction{

    hash: string;
    address: string;
    transactionData: TransactionData[];
    
    constructor(address:string, transactionData:TransactionData[]){
        this.address = address;
        this.transactionData = transactionData;
        this.hash = this.calculateHash();
    }
    
    /**
     * Get transaction's hash
     * @returns Transaction's hash
     */
    calculateHash():string{
        return sha256(this.address + this.hash + this.transactionData).toString();
    }

    // getConcernedOutTransactionDataAmount():number{
    //     for(let i = this.transactionData.length-1; i>=0; i--){
    //         const { type, address, amount }  = this.transactionData[i];
    //         if(address == this.address && type == TransactionTypeEnum.OUT)
    //             return amount;
    //     }
    //     return 0;
    // }

    /** 
    * Get all OUT amounts of a specific user in this transaction.
    * @param user User to check
    * @returns User's balance
    */
    getAllReceivedOf(user:string):number{
        let totalAmount:number = 0;
        for(let i = this.transactionData.length-1; i>=0; i--){
            const { type, address, amount } = this.transactionData[i];
            if(address == user && type == TransactionTypeEnum.OUT) totalAmount += amount;
        }
        return totalAmount;
    }

    /**
     * Check if all IN == all OUT and if Balance == all IN
     * @param blockchain The current blockchain you're working on
     * @returns True if transaction data is valid
     */
    areInAndOutValid(blockchain:Blockchain):boolean{
        let totalIn:number = 0;
        let totalOut:number = 0;
        for(const { type, amount, address } of this.transactionData){
            if(address == "COINBASE") return false; // COINBASE only takes part of transactions added when a block is mined, therefore can't exist when trying to validate
            else if(type == TransactionTypeEnum.IN) totalIn += amount;
            else totalOut += amount;
        }
        return totalIn == totalOut && totalIn == blockchain.getBalance(this.address);
    }
}