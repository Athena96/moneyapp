
import { Key } from "./KeyInterface";

export class Account {

    name: string;


    constructor(name: string) {
        this.name = name;
    }

    getKey() {
        return this.name;
    }

}

