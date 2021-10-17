
import { Key } from "../Interfaces/KeyInterface";

export class Simulation implements Key {

    id: string;
    name: string;
    selected: number;

    constructor(id: string, name: string, selected: number) {
        this.id = id;
        this.name = name;
        this.selected = selected;
    }

    getKey() {
        return this.id;
    }

}

