import { Category } from "./Category";
import { Key } from "../Interfaces/KeyInterface";
import { CategoryTypes } from "../../API";

export class Event implements Key {
    id: string;
    name: string;
    age: number;
    category: Category;
    type: CategoryTypes;
    simulation: string;

    constructor(id: string, name: string, age: number, category: Category,  type: CategoryTypes, simulation: string) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.category = category;
        this.type = type;
        this.simulation = simulation;
    }

    getKey() {
        return this.id;
    }

}