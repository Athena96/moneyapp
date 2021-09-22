import { Category } from "./Category";
import { CategoryTypes } from "./Category";
import { Key } from "./KeyInterface";

export class Budget implements Key {

    name: string;
    startDate: Date;
    endDate: Date;
    categories: Category[]

    constructor(name: string, startDate: Date, endDate: Date, categories: Category[]) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.categories = categories;
    }

  
    getTypeSum(type: CategoryTypes) {
        let sum = 0.0;
        for (const category of this.categories) {
            if (category.type === type) {
                sum += category.value;
            }
        }
        return sum;
    }

    getKey() {
        return `${this.startDate.getTime().toString()}-${this.endDate.getTime().toString()}`
    }

}

