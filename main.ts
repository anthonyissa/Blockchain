import { Block } from "./Model/Block";
import { Blockchain } from "./Model/Blockchain";
import { TransactionTypeEnum } from "./Model/Enum/enums";
import { Transaction } from "./Model/Transaction";
import { TransactionData } from "./Model/TransactionData";

const transactionData = new TransactionData("Alice", TransactionTypeEnum.IN, 1);
const transactionData2 = new TransactionData("Garry", TransactionTypeEnum.IN, 1);
const transactionData4 = new TransactionData("Garry", TransactionTypeEnum.OUT, 2);
const transaction = new Transaction("Garry", [transactionData, transactionData2, transactionData4])

const newBlock:Block = new Block(new Date().getTime(), [transaction]);
const blockchain:Blockchain = new Blockchain();

console.log(blockchain.chain);
blockchain.mineBlock(newBlock);
console.log(blockchain.getBalance("Charles"))