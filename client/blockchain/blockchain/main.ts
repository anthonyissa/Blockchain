import { Block } from "./Model/Block";
import { Blockchain } from "./Model/Blockchain";
import { TransactionTypeEnum } from "./Model/Enum/enums";
import { Transaction } from "./Model/Transaction";
import { TransactionData } from "./Model/TransactionData";

const transactionData1 = new TransactionData("Bob", TransactionTypeEnum.IN, 1);
const transactionData2 = new TransactionData("Alice", TransactionTypeEnum.OUT, 0.1);
const transactionData3 = new TransactionData("Bob", TransactionTypeEnum.OUT, 0.9);
const transaction = new Transaction("Bob", [transactionData1, transactionData2, transactionData3])

const transactionData11 = new TransactionData("Alice", TransactionTypeEnum.IN, 1)
const transactionData22 = new TransactionData("Bob", TransactionTypeEnum.OUT, 0.5);
const transactionData33 = new TransactionData("Alice", TransactionTypeEnum.OUT, 0.5);
const transaction2 = new Transaction("Alice", [transactionData11, transactionData22, transactionData33])
 
const newBlock:Block = new Block(new Date().getTime(), [transaction, transaction2]);
const blockchain:Blockchain = new Blockchain();

blockchain.checkBlock(newBlock);

console.log("Alice : "+blockchain.getBalance("Alice"))
console.log("Bob : "+blockchain.getBalance("Bob"))

console.log(blockchain.chain);
// console.log(JSON.stringify(blockchain.chain, null, 4));

blockchain.mineBlock(newBlock, "Bob");
console.log(blockchain.chain);
console.log(blockchain.getBalance("Alice"))
console.log(blockchain.getBalance("Bob"))