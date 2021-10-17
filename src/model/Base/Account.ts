
import { Key } from "../Interfaces/KeyInterface";

export class Account implements Key {

    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    
    }

    getKey() {
        return this.id;
    }

}

