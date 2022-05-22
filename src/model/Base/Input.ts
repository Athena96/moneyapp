
import { Key } from "../Interfaces/KeyInterface";

export class Input implements Key {

    id: string;
    settings: string;
    simulation: string;

    constructor(id: string, settings: string, simulation: string) {
        this.id = id;
        this.settings = settings;
        this.simulation = simulation;
    }

    getKey() {
        return this.id;
    }

}

