

import { Key } from "../Interfaces/KeyInterface";
import { AssetAllocation } from "./AssetAllocation";

export class Input implements Key {

    id: string;
    age: number;
    firstSignIn: boolean;
    assetAllocation: AssetAllocation;
    simulation: string;

    constructor(id: string, 
        age: number,
        firstSignIn: boolean,
        assetAllocation: AssetAllocation,
        simulation: string) {
            this.id = id;
            this.age = age;
            this.firstSignIn = firstSignIn;
            this.assetAllocation = assetAllocation;
            this.simulation = simulation;
    }

    getKey() {
        return this.id;
    }
}