
import { Budget } from "./Budget";

export class BudgetFactory {

    static fromBudget(budget: Budget) {
        const copyName = `COPY OF '${budget.name}'`;
        return new Budget(new Date().getTime().toString(), copyName, budget.startDate, budget.endDate, budget.categories);
    }

}