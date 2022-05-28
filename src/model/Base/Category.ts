import { Key } from "../Interfaces/KeyInterface";
import { CategoryTypes } from "../../API";

export class Category implements Key {
    id: string;
    name: string;
    value: number;
    strValue?: string;

    constructor(id: string, name: string, value: number) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.strValue = String(value);
    }

    getValue() {
        return this.value;
    }

    setValue(newVal: string) {
        this.value = Number(newVal);
        this.strValue = newVal;
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

