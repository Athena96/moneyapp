import { Category } from "./Category";


export class Budget {

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

  
    getTypeSum(type: number) {
        let sum = 0.0;
        for (const category of this.categories) {
            if (category.type === type) {
                sum += category.value;
            }
        }
        return sum;
    }

}

