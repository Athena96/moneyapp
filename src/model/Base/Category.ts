import { Key } from "../Interfaces/KeyInterface";
import { CategoryTypes } from "../../API";

export class Category implements Key {
    id: string;
    name: string;
    value: number;

    constructor(id: string, name: string, value: number) {
        this.id = id;
        this.name = name;
        this.value = value;
    }

     getValue() {
        return this.value;
    }

    printCategory() {
        console.log(`[Category] name: ${this.name} value: ${this.value} `)
    }

    getCategoryDescription() {
        return `[Category] name: ${this.name} value: ${this.value}`;
    }

    getKey() {
        return this.id;
    }
}

