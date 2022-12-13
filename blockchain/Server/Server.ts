import { Block } from "../Model/Block";
import { Blockchain } from "../Model/Blockchain";

export const initServer = () => {
    const newBlock:Block = new Block(new Date().getTime(), []);
    const blockchain:Blockchain = new Blockchain();

    newBlock.addTransaction("Bob", "Alice", 0.1, blockchain);
    newBlock.addTransaction("Alice", "Bob", 0.5, blockchain);

    console.log(newBlock);

    blockchain.checkBlock(newBlock);
    blockchain.mineBlock(newBlock, "Bob").then(()=> console.log("done"));

    return blockchain;
}