import { Block } from "./Model/Block";
import { Blockchain } from "./Model/Blockchain";

const newBlock:Block = new Block(new Date().getTime(), []);
const blockchain:Blockchain = new Blockchain();

console.log(blockchain.chain);
blockchain.mineBlock(newBlock);
console.log(blockchain.chain);