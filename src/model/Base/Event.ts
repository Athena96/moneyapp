import { Category } from "./Category";
import { Key } from "../Interfaces/KeyInterface";

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

    getKey() {
        return this.id;
    }

}