import { Category } from "./Category";

export class Event {
    name: string;
    date: Date;
    account: string;
    category: Category | undefined;

    constructor(name: string, date: Date, account: string, category: Category | undefined = undefined) {
        this.name = name;
        this.date = date;
        this.account = account;
        this.category = category;
    }

    printEvent() {
        console.log(`[Event] name: ${this.name} date: ${this.date.getMonth()}-${this.date.getFullYear()} category: ${this.category ? this.category!.getCategoryDescription() : '...'} account: ${this.account}`)
    }


}


