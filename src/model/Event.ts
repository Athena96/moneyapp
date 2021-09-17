import { Category } from "./Category";

export class Event {
    name: string;
    date: Date;
    account: string;
    category: Category;

    constructor(name: string, date: Date, account: string, category: Category) {
        this.name = name;
        this.date = date;
        this.account = account;
        this.category = category;
    }


}


