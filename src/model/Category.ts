
export enum CategoryTypes {
    Expense,
    Income,
}
export class Category {

    name: string;
    value: number;
    type: CategoryTypes;
    security: string | null;

    constructor(name: string, value: number, type: CategoryTypes, security: string | null) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.security = security;
    }

     getValue() {
        return this.value;
    }

    printCategory() {
        console.log(`[Category] name: ${this.name} value: ${this.value} type: ${this.type === 1 ? 'Income' : 'Expense'}`)
    }

    getCategoryDescription() {
        return `[Category] name: ${this.name} value: ${this.value} type: ${this.type === 1 ? 'Income' : 'Expense'}`;
    }
}

