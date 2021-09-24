import { Category } from "./Category";
import { Key } from "./KeyInterface";

export class Event implements Key {
    id: string;
    name: string;
    date: Date;
    account: string;
    category: Category | null;

    constructor(id: string, name: string, date: Date, account: string, category: Category | null) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.account = account;
        this.category = category;
    }

    printEvent() {
        console.log(`[Event] name: ${this.name} account: ${this.account} date: ${this.date.getMonth()+1}-${this.date.getFullYear()} category: ${this.category ? this.category!.getCategoryDescription() : '...'} account: ${this.account}`)
    }
    
    toStringEvent() {
        return `[Event] name: ${this.name} account: ${this.account} date: ${this.date.getMonth()+1}-${this.date.getFullYear()} category: ${this.category ? this.category!.getCategoryDescription() : '...'} account: ${this.account}`;
    }
    getKey() {
        return this.id;
    }

}