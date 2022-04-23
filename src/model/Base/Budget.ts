import { Category } from "./Category";
import { CategoryTypes } from "../../API";
import { Key } from "../Interfaces/KeyInterface";

export class Budget implements Key {

    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    categories: Category[] | null;

    constructor(id: string, name: string, startDate: Date, endDate: Date, categories: Category[] | null) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.categories = categories;
    }

    getTypeSum(type: CategoryTypes) {
        let sum = 0.0;
        if (this.categories) {
            for (const category of this.categories!) {
                if (category.type === type) {
                    sum += category.value;
                }
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

