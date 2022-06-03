
import { Simulation } from '../model/Base/Simulation';
import { listSimulations } from '../graphql/queries'
import { ListSimulationsQuery, SimulationStatus } from "../API";
import { API } from 'aws-amplify'

export class SimulationDataAccess {

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
            console.log(error);
        }
        return fetchedSimulations;
    }

    static async fetchSelectedSimulationForUser(componentState: any|null, user: string): Promise<Simulation | undefined> {
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
            console.log(error);
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

}