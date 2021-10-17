
import { Simulation } from '../model/Simulation';
import { Input } from '../model/Input';
import { Budget } from '../model/Budget';
import { Category } from '../model/Category';

import { ListBudgetsQuery } from "../API";
import { API, graphqlOperation } from 'aws-amplify'
import { listBudgets } from '../graphql/queries'
import { createBudget } from '../graphql/mutations';
import { CategoryTypes } from "../API";
import { SimulationDataAccess } from './SimulationDataAccess';
import { fetchDefaultInputs, fetchInputs, getInputForKeyFromList } from './helpers';

export class BudgetDataAccess {

    static async fetchBudgets(componentState: any, simulations: Simulation[]) {
        const selectedSim = SimulationDataAccess.getSelectedSimulation(simulations);

        // fetch inputs.
        let inputs: Input[] = await fetchInputs(null, simulations);
        let fetchedBudgets: Budget[] = [];
        try {
            const response = (await API.graphql({
                query: listBudgets
            })) as { data: ListBudgetsQuery }
            for (const budget of response.data.listBudgets!.items!) {
                if (budget?.simulation && budget?.simulation! === selectedSim?.id!) {
                    let cats = null;

                    if (budget?.categories) {
                        cats = [];
                        for (const category of budget!.categories!) {
                            // if category.name === input.name... use input.value.
                            const matchingInput = getInputForKeyFromList(category!.name!, inputs);
                            if (matchingInput != null) {
                                cats.push(new Category('', category!.name!, Number(matchingInput.value), (category!.type!.toString() === "Expense" ? CategoryTypes.Expense : CategoryTypes.Income)));
                            } else {
                                cats.push(new Category('', category!.name!, category!.value!, (category!.type!.toString() === "Expense" ? CategoryTypes.Expense : CategoryTypes.Income)));
                            }
                        }
                    }
                    fetchedBudgets.push(new Budget(budget!.id!, budget!.name!, new Date(budget!.startDate!), new Date(budget!.endDate!), cats));
                }
            }

            componentState.setState({ budgets: fetchedBudgets })
        } catch (error) {
            console.log(error);
        }
    }

    static async fetchDefaultBudgets(selectedSimulationId: string): Promise<Budget[]> {

        // fetch inputs.
        let inputs: Input[] = await fetchDefaultInputs(selectedSimulationId);
        let fetchedBudgets: Budget[] = [];
        try {
            const response = (await API.graphql({
                query: listBudgets
            })) as { data: ListBudgetsQuery }
            for (const budget of response.data.listBudgets!.items!) {

                if (budget?.simulation && budget?.simulation! === selectedSimulationId) {

                    let cats = null;

                    if (budget?.categories) {
                        cats = [];
                        for (const category of budget!.categories!) {
                            // if category.name === input.name... use input.value.
                            const matchingInput = getInputForKeyFromList(category!.name!, inputs);
                            if (matchingInput != null) {
                                cats.push(new Category('', category!.name!, Number(matchingInput.value), (category!.type!.toString() === "Expense" ? CategoryTypes.Expense : CategoryTypes.Income)));
                            } else {
                                cats.push(new Category('', category!.name!, category!.value!, (category!.type!.toString() === "Expense" ? CategoryTypes.Expense : CategoryTypes.Income)));
                            }
                        }
                    }
                    fetchedBudgets.push(new Budget(budget!.id!, budget!.name!, new Date(budget!.startDate!), new Date(budget!.endDate!), cats));
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