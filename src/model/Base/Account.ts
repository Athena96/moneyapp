
import { Key } from "../Interfaces/KeyInterface";

export class Account implements Key {

    id: string;
    name: string;
    taxAdvantaged: number;
    
    constructor(id: string, name: string, taxAdvantaged: number) {
        this.id = id;
        this.name = name;
        this.taxAdvantaged = taxAdvantaged;
    }

    getKey() {
        return this.id;
    }

}

