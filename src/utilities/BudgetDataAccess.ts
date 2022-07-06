import { Budget } from '../model/Base/Budget';
import { Category } from '../model/Base/Category';
import { ListBudgetsQuery } from "../API";
import { API, graphqlOperation } from 'aws-amplify'
import { listBudgets } from '../graphql/queries'
import { createBudget } from '../graphql/mutations';

export class BudgetDataAccess {

    static convertToDDBObject(budget: Budget, sim: string) {
        let cats: Category[] = []
        for (const cat of budget.categories) {
            const cc = new Category(cat.id, cat.name, cat.value);
            delete cc.strValue;
            cats.push(cc)
        }
        let b: any = new Budget(budget.id, budget.name, budget.startDate, budget.endDate, cats, budget.type)
        b['simulation'] = sim;
        return b;
    }

    static async fetchBudgetsForSelectedSim(componentState: any, userSimulation: string): Promise<Budget[]> {

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
                            cats.push(new Category(category.id || "", category.name || "", category.value|| 0.0));   
                        }
                    }

                    fetchedBudgets.push(new Budget(budget!.id!, budget!.name!, new Date(budget!.startDate!), new Date(budget!.endDate!), cats, budget!.type!));
                }
            }

            if (componentState) {
                componentState.setState({ budgets: fetchedBudgets })
            }
        } catch (error) {
            console.log(error);
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
                            cats.push(new Category(category.id || "", category.name || "", category.value|| 0.0));   
                        }
                    }
                    fetchedBudgets.push(new Budget(budget!.id!, budget!.name!, new Date(budget!.startDate!), new Date(budget!.endDate!), cats, budget!.type!));
                }
            }

        } catch (error) {
            console.log(error);
        }

        return fetchedBudgets;
    }

    static async createBudgetBranch(budget: any) {
        try {
            await API.graphql(graphqlOperation(createBudget, { input: budget }))
        } catch (err) {
            console.log('error creating budget:', err)
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
            console.log(error);
        }
        return fetchedBudgets;
    }

}