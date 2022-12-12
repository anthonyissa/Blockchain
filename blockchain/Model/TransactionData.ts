export class TransactionData{

    amount: number;
    address: string;
    type: any;

    constructor(address: string, type:any, amount:number){
        this.address = address;
        this.amount = amount;
        this.type = type;
    }

}

