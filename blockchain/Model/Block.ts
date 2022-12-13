import { Transaction } from "./Transaction";
import sha256 from 'crypto-js/sha256';
import { BlockStatusEnum, TransactionTypeEnum } from "./Enum/enums";
import { Blockchain } from "./Blockchain";
import { TransactionData } from "./TransactionData";

export class Block {

    /* TODO: readonly*/ index: number;
    timestamp: number;
    minedTimestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;
    miner: string;
    status: BlockStatusEnum;

    constructor(timestamp: number, transactions: Transaction[], previousHash: string = "0x", index: number = 0) {
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
    calculateHash(): string {
        return sha256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions)).toString();
    }

    /**
     * Validates a block if each transactions IN and OUT are valid and if block doesn't contain minted coins
     * @param blockchain The current blockchain you're working on
     * @returns True if transactions are valid
     */
    validateBlock(): boolean {
        if (this.status != BlockStatusEnum.NEW) return false;
        for (const transaction of this.transactions) {
            if (transaction.address == "COINBASE") return false; // COINBASE -> MINT
            else if (!transaction.areInAndOutValid()) return false;

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
    addMintTransaction(miner: string, reward: number): boolean {
        if (this.status != BlockStatusEnum.PENDING) return false;
        this.miner = miner;
        this.transactions.push(new Transaction("COINBASE", [new TransactionData("COINBASE", TransactionTypeEnum.IN, reward), new TransactionData(miner, TransactionTypeEnum.OUT, reward), new TransactionData("COINBASE", TransactionTypeEnum.OUT, 0)]));
        return true;
    }

    /**
     * Check if user has spent coins in one of this block's transactions
     * @param user User you wish to check
     * @returns True if user spent in this block
     */
    hasUserSpentInThisBlock(user: string): boolean {
        return this.transactions.find((transaction) => transaction.address == user) ? true : false;
    }

    /** TODO: temp function
     * Add a new transaction to the block
     * @param from User from which the amount is sent
     * @param to User to which the amount is sent
     * @param amount Amount to send
     * @param blockchain The current blockchain you're working on
     */
    addTransaction(from: string, to: string, amount: number, blockchain: Blockchain) {
        this.status = BlockStatusEnum.NEW;
        const balance = this.getBalanceFromThisBlockPerspective(from, blockchain);
        this.transactions.push(new Transaction(from,
            [
                new TransactionData(from, TransactionTypeEnum.IN, balance),
                new TransactionData(from, TransactionTypeEnum.OUT, balance - amount),
                new TransactionData(to, TransactionTypeEnum.OUT, amount)
            ]));
    }

    getBalanceFromThisBlockPerspective(user: string, blockchain: Blockchain) {
        return (this.transactions.length == 0 || !this.hasUserSpentInThisBlock(user)) ? blockchain.getBalance(user) : this.getLastOutForUser(user);
    }

    /**
     * Get last out amount of user in his last transaction of this block
     * Used to know if user is double spending or not in a new block
     * @param address User address
     * @returns last out amount of user
     */
    getLastOutForUser(address: string) {
        for (let i = this.transactions.length - 1; i >= 0; i--) {
            if (this.transactions[i].address == address) {
                for (let j = this.transactions[i].transactionData.length - 1; j >= 0; j--) {
                    if (this.transactions[i].transactionData[j].address == address) return this.transactions[i].transactionData[j].amount;
                }
            }
        }
        return 0;
    }

}

export class GenesisBlock extends Block {

    constructor(timestamp: number, transactions: Transaction[], previousHash: string = "0x", index: number = 0) {
        super(timestamp, transactions, previousHash, index);
        this.status = BlockStatusEnum.MINED;
    }

}