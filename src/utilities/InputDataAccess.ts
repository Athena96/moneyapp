
import { Input } from '../model/Base/Input';
import { listInputs } from '../graphql/queries'
import { createInputs } from '../graphql/mutations';
import { ListInputsQuery } from "../API";
import { API, graphqlOperation } from 'aws-amplify'

export class InputDataAccess {

    static async fetchInputsForSelectedSim(componentState: any | null, selectedSimulationId: string): Promise<Input> {
        let selectedInput: Input | undefined = undefined;
        try {
            const response = (await API.graphql({
                query: listInputs
            })) as { data: ListInputsQuery }

            for (const input of response.data.listInputs!.items!) {
                if (input?.simulation && input?.simulation! === selectedSimulationId) {
                    selectedInput = new Input(input!.id!, input!.settings!, input!.simulation!)
                    break;
                }
            }

            console.log(JSON.stringify("selectedInput " + JSON.stringify(selectedInput)))
            if (componentState) {
                console.log(JSON.stringify("selectedInput2 " + JSON.stringify(selectedInput)))

                componentState.setState({ input: selectedInput })
            }
        } catch (error) {
            console.log("error");

            console.log(error);
        }
        return selectedInput!;
    }

    static async createInputBranch(input: any) {
        try {
            await API.graphql(graphqlOperation(createInputs, { input: input }))
        } catch (err) {
            console.log('error creating event:', err)
        }
    }


}