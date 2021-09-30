
import { Key } from "./KeyInterface";

export class Input implements Key {

    id: string;
    key: string;
    value: string;
    type: string; // data type: date, string, number...

    constructor(id: string, key: string, value: string, type: string) {
        this.id = id;
        this.key = key;
        this.value = value;
        this.type = type; 
    }

    getKey() {
        return this.id;
    }

}

