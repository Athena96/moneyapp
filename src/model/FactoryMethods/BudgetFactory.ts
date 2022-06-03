
import { Budget } from "../Base/Budget";
import { Category } from "../Base/Category";

export class BudgetFactory {

    static fromBudget(budget: Budget) {
        const copyName = `COPY OF '${budget.name}'`;

        // deep copy categories
        let newCategories: Category[] = []
        for (let i = 0; i < budget.categories.length; i += 1) {
            newCategories.push(new Category(String(i), budget.categories[i].name, budget.categories[i].value))
        }
        return new Budget(new Date().getTime().toString(), copyName, budget.startDate, budget.endDate, newCategories, budget.type);

    }

}