
import { Key } from "../Interfaces/KeyInterface";

export class Asset implements Key {
    id: string;
    ticker: string;
    quantity: number;
    strQuantity: string | undefined;
    hasIndexData: number;
    account: string;
    isCurrency: number;

    constructor(id: string, ticker: string, strQuantity: string, hasIndexData: number, account: string, isCurrency: number) {
        this.id = id;
        this.ticker = ticker;
        this.quantity = Number(strQuantity);
        this.hasIndexData = hasIndexData;
        this.account = account;
        this.isCurrency = isCurrency;
        this.strQuantity = strQuantity
    }

    setQuantity(quantity: string) {
        this.strQuantity = quantity;
        this.quantity = Number(parseFloat(quantity).toFixed(10));
    }

    printAsset() {
        console.log(JSON.stringify(this));
    }
  
    getKey() {
        return this.id;
    }

}