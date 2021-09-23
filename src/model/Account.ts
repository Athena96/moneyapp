
import { Key } from "./KeyInterface";

export class Account {

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

