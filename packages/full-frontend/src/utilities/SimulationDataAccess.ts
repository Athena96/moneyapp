
import { Simulation } from '../model/Base/Simulation';
import { listSimulations } from '../graphql/queries'
import { ListSimulationsQuery, SimulationStatus } from "../API";
import { API, graphqlOperation } from 'aws-amplify'
import { createSimulation, deleteBudget, deleteEvent, deleteInputs, deleteSimulation, updateSimulation } from '../graphql/mutations';
import { BudgetDataAccess } from './BudgetDataAccess';
import { EventDataAccess } from './EventDataAccess';
import { InputDataAccess } from './InputDataAccess';
import { AssetDataAccess } from './AssetDataAccess';
import { Budget } from '../model/Base/Budget';
import { Event } from '../model/Base/Event';
import { Input } from '../model/Base/Input';
import { Asset } from '../model/Base/Asset';

export class SimulationDataAccess {

    static async updateSimulation(newSimulation: Simulation): Promise<void> {
        try {
            await API.graphql(graphqlOperation(updateSimulation, { input: newSimulation }))
        } catch (err) {
            console.error('error updateSimulation:', err)
        }
    }

    static async fetchSimulationsForUser(componentState: any, user: string): Promise<Simulation[]> {
        let fetchedSimulations: Simulation[] = [];
        try {
            const response = (await API.graphql({
                query: listSimulations
            })) as { data: ListSimulationsQuery }
            let selSim: any;
            for (const simulation of response.data.listSimulations!.items!) {
                if (simulation?.user && simulation.user! === user) {
                    fetchedSimulations.push(
                        new Simulation(
                            simulation!.id!,
                            simulation!.name!,
                            simulation!.selected!,
                            simulation!.simulationData!,
                            simulation!.successPercent!,
                            new Date(simulation!.lastComputed!),
                            simulation!.user!,
                            simulation!.status || SimulationStatus.Done)
                    );
                }
            }
            componentState.setState({ simulations: fetchedSimulations, selectedSimulation: selSim })
        } catch (error) {
            console.error(error);
        }
        return fetchedSimulations;
    }

    static async fetchSelectedSimulationForUser(componentState: any | null, user: string): Promise<Simulation | undefined> {
        let selectedSimulation: Simulation | undefined = undefined;
        try {
            const response = (await API.graphql({
                query: listSimulations
            })) as { data: ListSimulationsQuery }

            for (const simulation of response.data.listSimulations!.items!) {
                if (simulation?.selected === 1 && simulation.user && simulation.user === user) {
                    selectedSimulation = new Simulation(
                        simulation!.id!,
                        simulation!.name!,
                        simulation!.selected!,
                        simulation!.simulationData!,
                        simulation!.successPercent!,
                        new Date(simulation!.lastComputed!),
                        simulation!.user!,
                        simulation!.status || SimulationStatus.Done)
                    break;
                }
            }
            if (componentState) {
                componentState.setState({ simulations: [selectedSimulation], selectedSimulation: selectedSimulation })
            }
        } catch (error) {
            console.error(error);
        }
        return selectedSimulation!;
    }

    static getSelectedSimulation(simulations: Simulation[]) {
        for (const sim of simulations) {
            if (sim.selected === 1) {
                return sim;
            }
        }
    }

    static async deleteSelectedSimulation(simulation: Simulation) {
        try {
            const simulationToDelete = {
                'id': simulation.id
            }
            await API.graphql({ query: deleteSimulation, variables: { input: simulationToDelete } });

            // get all budgets
            //  if simulation == simtodelte.id
            //  delete
            const budgets = await BudgetDataAccess.fetchBudgetsForSelectedSim(simulationToDelete!['id']);
            const events = await EventDataAccess.fetchEventsForSelectedSim(simulationToDelete!['id']);
            const input = await InputDataAccess.fetchInputsForSelectedSim(simulationToDelete!['id']);
            const assets = await AssetDataAccess.fetchAssetsForSelectedSim(simulationToDelete!['id']);

            for (const b of budgets) {

                try {
                    await API.graphql({ query: deleteBudget, variables: { input: { 'id': b.id } } });
                } catch (err) {
                    console.error('error:', err)
                }

            }

            for (const e of events) {

                try {
                    await API.graphql({ query: deleteEvent, variables: { input: { 'id': e.id } } });
                } catch (err) {
                    console.error('error:', err)
                }

            }

            // for (const i of inputs) {

            try {
                await API.graphql({ query: deleteInputs, variables: { input: { 'id': input.id } } });
            } catch (err) {
                console.error('error:', err)
            }

            // }

            for (const as of assets) {
                try {
                    await API.graphql({ query: deleteInputs, variables: { input: { 'id': as.id } } });
                } catch (err) {
                    console.error('error:', err)
                }
            }
        } catch (err) {
            console.error('error:', err);

        }
    }

    static async createSimulation(simulation: Simulation) {
        try {
            await API.graphql(graphqlOperation(createSimulation, { input: simulation }));
        } catch (err) {
            console.error(err)
        }
    }


    static async createSimulationFromBase(baseSimulationId: string, user: string) {

        try {


            let newSimulation = new Simulation(new Date().getTime().toString(), '...', 0, '[]', "", new Date(), user, SimulationStatus.Done);
            await API.graphql(graphqlOperation(createSimulation, { input: newSimulation }));

            // pull budgets from the current selected simulation
            const defaultBudgets: Budget[] = await BudgetDataAccess.fetchDefaultBudgets(baseSimulationId);

            // pull events  ...
            const defaultEvents: Event[] = await EventDataAccess.fetchEventsForSelectedSim(baseSimulationId);

            // pull inputs  ...
            const defaultInputs: Input = await InputDataAccess.fetchInputsForSelectedSim(baseSimulationId);

            // pull inputs  ...
            const defaultAssets: Asset[] = await AssetDataAccess.fetchAssetsForSelectedSim(baseSimulationId);

            // for each budget
            //  make a copy
            //  set simulation to the newly created simulation id
            //  create budget
            for (const budget of defaultBudgets) {
                const cpBudget: any = budget;
                cpBudget['simulation'] = newSimulation.id;
                cpBudget['id'] = new Date().getTime().toString()
                let i = 0;
                for (const cat of cpBudget['categories']) {
                    cat['id'] = (new Date().getTime() + i).toString();
                    i += 1;
                }
                await BudgetDataAccess.createBudgetBranch(BudgetDataAccess.convertToDDBObject(cpBudget, newSimulation.id));
            }

            // same for events
            for (const event of defaultEvents) {
                const cpEvent: any = event;
                cpEvent['simulation'] = newSimulation.id;
                cpEvent['id'] = new Date().getTime().toString()
                await EventDataAccess.createEventBranch(EventDataAccess.convertToDDBObject(cpEvent, newSimulation.id));
            }

            // same for inputs
            // for (const input of defaultInputs) {
            const cpInput: any = defaultInputs;
            cpInput['simulation'] = newSimulation.id;
            cpInput['id'] = new Date().getTime().toString()
            await InputDataAccess.createInputBranch(cpInput);
            // }

            // same for assets
            for (const asset of defaultAssets) {
                const cpAsset: any = asset;
                cpAsset['simulation'] = newSimulation.id;
                cpAsset['id'] = new Date().getTime().toString()
                delete cpAsset['strQuantity'];
                await AssetDataAccess.createAssetBranch(cpAsset);
            }

            return newSimulation;
        } catch (err) {
            console.error('error creating...:', err);
        }



        // let newSimulation = new Simulation(new Date().getTime().toString(), '...', 1, '[]', "", new Date(), this.props.user, SimulationStatus.Done);
        // let newSimulations = [...this.state.simulations, newSimulation]
        // await API.graphql(graphqlOperation(createSimulation, { input: newSimulation }));
        // this.setState({ simulations: newSimulations });
        // this.setState({ isLoading: false });

    }
}