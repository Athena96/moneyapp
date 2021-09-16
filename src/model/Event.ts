import { Category } from "./Category";

export class Event {
    name: string;
    date: Date;
    budget: string;
    category: Category;

    constructor(name: string, date: Date, budget: string, category: Category) {
        this.name = name;
        this.date = date;
        this.budget = budget;
        this.category = category;
    }


}


