import { Category } from "./Category";
import { Key } from "../Interfaces/KeyInterface";
import { CategoryTypes } from "../../API";

export class Event implements Key {
    id: string;
    name: string;
    date: Date;
    account: string;
    category: Category;
    type: CategoryTypes;

    constructor(id: string, name: string, date: Date, account: string, category: Category,  type: CategoryTypes) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.account = account;
        this.category = category;
        this.type = type;
    }

    getKey() {
        return this.id;
    }

}