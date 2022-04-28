
import { Input } from '../model/Base/Input';
import { Simulation } from '../model/Base/Simulation';
import { listInputs } from '../graphql/queries';
import { ListInputsQuery } from '../API';
import { API, graphqlOperation } from 'aws-amplify'

import { createInputs } from '../graphql/mutations';
import { SimulationDataAccess } from './SimulationDataAccess';


export class InputDataAccess {


    static async paginateInputs() {
        let nxtTkn: string | null | undefined;
        let events: any = []
        do {
            const response = (await API.graphql({
                query: listInputs, variables: { nextToken: nxtTkn }
            })) as { data: ListInputsQuery }

            for (const event of response.data.listInputs!.items!) {
                events.push(event);
            }
            nxtTkn = response.data.listInputs?.nextToken;
        } while (nxtTkn !== null);

        return events;

    }


    static async fetchInputs(componentState: any | null, userSimulation: string): Promise<Input[]> {


        let fetchedInputs: Input[] = [];
        let growth = 0.0;
        let inflation = 0.0;
        try {
            // #todo: waistful im getting ALL inputs, but should query by simulation ID.
            const response = await InputDataAccess.paginateInputs();
            for (const input of response) {

                if (input?.simulation && input?.simulation! === userSimulation) {
                    fetchedInputs.push(new Input(
                        input?.id!,
                        input?.key!,
                        input?.value!,
                        input?.type!
                    ));

                    if (input?.key === 'growth') {
                        growth = Number(input?.value!);
                    }
                    if (input?.key === 'inflation') {
                        inflation = Number(input?.value!);
                    }
                }

            }

            // add computed inputs
            fetchedInputs.push(new Input(
                new Date().getTime().toString(),
                "absoluteMonthlyGrowth",
                String((growth - inflation) / 12 / 100),
                "computed-number"
            ));

            fetchedInputs.push(new Input(
                new Date().getTime().toString(),
                "startDate",
                new Date().toString(),
                "computed-date",
            ));

            if (componentState != null) {
                componentState.setState({ inputs: fetchedInputs } as any);
                for (const i of fetchedInputs) {
                    if (i?.type === 'date' || i?.type === "computed-date") {
                        componentState.setState({ [i.key]: new Date(i.value) } as any);

                    } else if (i?.type === "number" || i?.type === "computed-number") {
                        componentState.setState({ [i.key]: Number(i.value) } as any);

                    }
                }
            }
        } catch (error) {
            console.log(error);
        }

        return fetchedInputs;
    }

    static getInputForKeyFromList(key: string, inputs: Input[]): Input | null {
        for (const input of inputs) {
            if (input.key === key) {
                return input;
            }
        }
        return null;
    }

    static async fetchDefaultInputs(selectedSimulationId: string): Promise<Input[]> {
        let fetchedInputs: Input[] = [];
        try {
            const response = await InputDataAccess.fetchAllInputs();
            for (const input of response) {
                if (input?.simulation && input?.simulation! === selectedSimulationId) {
                    fetchedInputs.push(new Input(
                        input?.id!,
                        input?.key!,
                        input?.value!,
                        input?.type!
                    ));
                }
            }
        } catch (error) {
            console.log(error);
        }

        return fetchedInputs;
    }

    static async fetchAllInputs() {
        let fetchedInputs: any = [];
        try {
            const response = await InputDataAccess.paginateInputs();

            for (const input of response) {
                fetchedInputs.push(input);
            }

        } catch (error) {
            console.log(error);
        }
        return fetchedInputs;
    }

    static async createInputBranch(ipt: any) {
        try {
            await API.graphql(graphqlOperation(createInputs, { input: ipt }))
        } catch (err) {
            console.log('error creating input:', err)
        }
    }


}