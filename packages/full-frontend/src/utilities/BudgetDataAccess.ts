import { Budget } from '../model/Base/Budget';
import { Category } from '../model/Base/Category';
import { GetBudgetQuery, ListBudgetsQuery } from "../API";
import { API, graphqlOperation } from 'aws-amplify'
import { getBudget, listBudgets } from '../graphql/queries'
import { createBudget, deleteBudget, updateBudget } from '../graphql/mutations';

export class BudgetDataAccess {

    static convertToDDBObject(budget: Budget, sim: string) {
        let cats: Category[] = []
        for (const cat of budget.categories) {
            const cc = new Category(cat.id, cat.name, cat.value);
            cats.push(cc)
        }
        let b: any = new Budget(budget.id, budget.name, budget.startAge, budget.endAge, cats, budget.type, sim)
        b['simulation'] = sim;
        return b;
    }

    static async updateBudget(newBudget: Budget): Promise<void> {
        try {
            await API.graphql(graphqlOperation(updateBudget, { input: newBudget }))
        } catch (err) {
            console.error('error updateBudget:', err)
        }
    }

    static async createBudget(budget: Budget): Promise<void> {
        try {
            await API.graphql(graphqlOperation(createBudget, { input: budget }))
        } catch (err) {
            console.error('error createBudget:', err)
        }
    }

    static async deleteBudget(budegetIdToDelete: string) {
        try {
            await API.graphql(graphqlOperation(deleteBudget, {
                input: {
                    'id': budegetIdToDelete
                }
            }))
        } catch (err) {
            console.error('error deleteBudget:', err)
        }
    }

    static async getBudget(budgetId: string): Promise<Budget> {
        try {
            const budgetData = await API.graphql({ query: getBudget, variables: { id: budgetId } }) as { data: GetBudgetQuery }
            const budget = budgetData.data!.getBudget!;
            let categories: Category[] | null = null;

            // get Categories
            if (budget.categories) {
                categories = []
                for (const c of budget.categories!) {
                    categories.push(new Category(c?.id!, c?.name!, c?.value!));
                }
            }

            return new Budget(
                budget.id!,
                budget.name!,
                budget.startAge!,
                budget.endAge!,
                categories!,
                budget.type!,
                budget.simulation!
            );
        } catch (err) {
            console.error('error:', err)
            throw new Error('failed')
        }
    }

    static async fetchBudgetsForSelectedSim(userSimulation: string): Promise<Budget[]> {

        // fetch inputs.
        let fetchedBudgets: Budget[] = [];
        try {
            const response = (await API.graphql({
                query: listBudgets
            })) as { data: ListBudgetsQuery }
            for (const budget of response.data.listBudgets!.items!) {
                if (budget?.simulation && budget?.simulation === userSimulation) {
                    let cats: Category[] = [];
                    for (const category of budget.categories || []) {
                        if (category) {
                            cats.push(new Category(category.id || "", category.name || "", category.value || 0.0));
                        }
                    }

                    fetchedBudgets.push(new Budget(budget!.id!, budget!.name!, budget!.startAge!, budget!.endAge!, cats, budget!.type!, userSimulation));
                }
            }
        } catch (error) {
            console.error(error);
        }
        return fetchedBudgets;

    }

    static async fetchDefaultBudgets(selectedSimulationId: string): Promise<Budget[]> {

        // fetch inputs.
        let fetchedBudgets: Budget[] = [];
        try {
            const response = (await API.graphql({
                query: listBudgets
            })) as { data: ListBudgetsQuery }
            for (const budget of response.data.listBudgets!.items!) {
                if (budget?.simulation && budget?.simulation! === selectedSimulationId) {
                    let cats: Category[] = [];
                    for (const category of budget.categories || []) {
                        if (category) {
                            cats.push(new Category(category.id || "", category.name || "", category.value || 0.0));
                        }
                    }
                    fetchedBudgets.push(new Budget(budget!.id!, budget!.name!, budget!.startAge!, budget!.endAge!, cats, budget!.type!, selectedSimulationId));
                }
            }

        } catch (error) {
            console.error(error);
        }

        return fetchedBudgets;
    }

    static async createBudgetBranch(budget: any) {
        try {
            await API.graphql(graphqlOperation(createBudget, { input: budget }))
        } catch (err) {
            console.error('error creating budget:', err)
        }
    }

    static async fetchAllBudgets() {
        let fetchedBudgets: any = [];
        try {
            const response = (await API.graphql({
                query: listBudgets
            })) as { data: ListBudgetsQuery }
            for (const budget of response.data.listBudgets!.items!) {
                fetchedBudgets.push(budget);
            }

        } catch (error) {
            console.error(error);
        }
        return fetchedBudgets;
    }

}