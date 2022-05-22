
import { Simulation } from '../model/Base/Simulation';
import { Input } from '../model/Base/Input';
import { Budget } from '../model/Base/Budget';
import { Category } from '../model/Base/Category';

import { ListBudgetsQuery } from "../API";
import { API, graphqlOperation } from 'aws-amplify'
import { listBudgets } from '../graphql/queries'
import { createBudget } from '../graphql/mutations';
import { CategoryTypes } from "../API";
import { SimulationDataAccess } from './SimulationDataAccess';

import { InputDataAccess } from './InputDataAccess';

export class BudgetDataAccess {

    static async fetchBudgetsForSelectedSim(componentState: any, userSimulation: string): Promise<Budget[]> {

        // fetch inputs.
        let fetchedBudgets: Budget[] = [];
        try {
            const response = (await API.graphql({
                query: listBudgets
            })) as { data: ListBudgetsQuery }
            for (const budget of response.data.listBudgets!.items!) {
                if (budget?.simulation && budget?.simulation! === userSimulation) {
                    let cats = null;

                    if (budget?.categories) {
                        cats = [];
                        for (const category of budget!.categories!) {
                            // if category.name === input.name... use input.value.

                            cats.push(new Category('', category!.name!, category!.value!));
                            
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

                    let cats = null;

                    if (budget?.categories) {
                        cats = [];
                        for (const category of budget!.categories!) {
                            // if category.name === input.name... use input.value.

                            cats.push(new Category('', category!.name!, category!.value!));
                            
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