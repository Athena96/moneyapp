
import { Key } from "./KeyInterface";

export class Holding implements Key {
    id: string;
    ticker: string;
    quantity: number;
    hasIndexData: number;
    account: string;
    isCurrency: number;

    constructor(id: string, ticker: string, quantity: number, hasIndexData: number, account: string, isCurrency: number) {
        this.id = id;
        this.ticker = ticker;
        this.quantity = quantity;
        this.hasIndexData = hasIndexData;
        this.account = account;
        this.isCurrency = isCurrency;

    }

    printEvent() {
        console.log(JSON.stringify(this));
    }
    
  
    getKey() {
        return this.id;
    }

}