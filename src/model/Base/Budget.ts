import { Category } from "./Category";
import { CategoryTypes } from "../../API";
import { Key } from "../Interfaces/KeyInterface";

export class Budget implements Key {

    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    categories: Category[] | null;
    type: CategoryTypes;

    constructor(id: string, name: string, startDate: Date, endDate: Date, categories: Category[] | null,  type: CategoryTypes) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.categories = categories;
        this.type = type;
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

