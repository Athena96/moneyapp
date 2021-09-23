import { Key } from "./KeyInterface";
import { CategoryTypes } from "../API";

// export enum CategoryTypes {
//     Expense,
//     Income,
// }
export class Category implements Key {
    id: string;
    name: string;
    value: number;
    type: CategoryTypes;

    constructor(id: string, name: string, value: number, type: CategoryTypes) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.type = type;
    }

     getValue() {
        return this.value;
    }

    printCategory() {
        console.log(`[Category] name: ${this.name} value: ${this.value} type: ${this.type}`)
    }

    getCategoryDescription() {
        return `[Category] name: ${this.name} value: ${this.value} type: ${this.type}`;
    }

    getKey() {
        return `${this.name}-${this.value}-${this.type.toString()}`
    }
}

