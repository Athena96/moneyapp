
import { Key } from "../Interfaces/KeyInterface";

export class Asset implements Key {
    id: string;
    ticker: string;
    quantity: number;
    hasIndexData: number;
    isCurrency: number;
    simulation: string;


    constructor(id: string, ticker: string, quantity: number, hasIndexData: number, isCurrency: number, simulation: string) {
        this.id = id;
        this.ticker = ticker;
        this.quantity = quantity
        this.hasIndexData = hasIndexData;
        this.isCurrency = isCurrency;
        this.simulation = simulation
    }

    setQuantity(quantity: string) {
        this.quantity = Number(parseFloat(quantity).toFixed(10));
    }

    printAsset() {
        console.log(JSON.stringify(this));
    }
  
    getKey() {
        return this.id;
    }

}