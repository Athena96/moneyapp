import { Category } from "./Category";
import { CategoryTypes } from "../../API";
import { Key } from "../Interfaces/KeyInterface";

export class Budget implements Key {

    id: string;
    name: string;
    startAge: number;
    endAge: number;
    categories: Category[];
    type: CategoryTypes;
    simulation: string

    constructor(id: string, name: string, startAge: number, endAge: number, categories: Category[],  type: CategoryTypes, simulation: string) {
        this.id = id;
        this.name = name;
        this.startAge = startAge;
        this.endAge = endAge;
        this.categories = categories;
        this.type = type;
        this.simulation = simulation;
    }

    getSum() {
        let sum = 0.0;
        if (this.categories) {
            for (const category of this.categories!) {
                sum += category.value;
            }
        }
        return sum;
    }

    getKey() {
        return this.id;
    }

    printBudget() {
        console.log(JSON.stringify(this));
    }

}

