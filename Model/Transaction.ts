export class Transaction{

    address: string;
    hash: string;
    in: string;
    out: string;
    
    constructor(hash:string, address:string, in:string, out:string, amount:number){
        this.address = address;
    }
    
}