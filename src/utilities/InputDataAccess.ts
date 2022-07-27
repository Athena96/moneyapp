
import { Input } from '../model/Base/Input';
import { createInputs } from '../graphql/mutations';
import { GlidePath } from "../API";
import { API, graphqlOperation } from 'aws-amplify'
import { Allocations } from '../model/Base/Allocations';
import { AssetAllocation } from '../model/Base/AssetAllocation';

export const myListInputs = /* GraphQL */ `
  query ListInputs(
    $filter: ModelInputsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInputs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        birthday
        firstSignIn
        assetAllocation {
          glidePath
          startAllocations {
            equities
            bonds
            cash
          }
          endAllocations {
            equities
            bonds
            cash
          }
        }
        simulation
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export type MyListInputsQuery = {
    listInputs?: {
        __typename: "ModelInputsConnection",
        items: Array<{
            __typename: "Inputs",
            id: string,
            birthday: string,
            firstSignIn: boolean,
            assetAllocation: {
                __typename: "AssetAllocation",
                startAllocations: {
                    __typename: "Allocations",
                    equities: string,
                    bonds: string,
                    cash: string,
                },
                endAllocations?: {
                    __typename: "Allocations",
                    equities: string,
                    bonds: string,
                    cash: string,
                } | null,
                glidePath?: GlidePath | null,
            },
            simulation: string,
            createdAt: string,
            updatedAt: string,
        } | null>,
        nextToken?: string | null,
    } | null,
};

//   "Validation error of type SubSelectionRequired: Sub selection required for type Allocations of field endAllocations @ 'listInputs/items/assetAllocation/endAllocations'"

export class InputDataAccess {

    static async fetchInputsForSelectedSim(componentState: any | null, selectedSimulationId: string): Promise<Input> {
        let selectedInput: Input | undefined = undefined;
        try {
            const response = (await API.graphql({
                query: myListInputs
            })) as { data: MyListInputsQuery }

            for (const input of response.data.listInputs!.items!) {
                if (input?.simulation && input?.simulation! === selectedSimulationId) {
                    let endAllocations: Allocations | undefined = undefined;
                    if (input.assetAllocation.endAllocations) {
                        endAllocations = new Allocations(
                            input.assetAllocation.endAllocations.equities,
                            input.assetAllocation.endAllocations.bonds,
                            input.assetAllocation.endAllocations.cash,
                        )
                    }

                    let glidePath: GlidePath | undefined = undefined;
                    if (input.assetAllocation.glidePath) {
                        glidePath = input.assetAllocation.glidePath
                    }

                    let startAllocations: Allocations = new Allocations(
                        input.assetAllocation.startAllocations.equities,
                        input.assetAllocation.startAllocations.bonds,
                        input.assetAllocation.startAllocations.cash)

                    const assetAllocations: AssetAllocation = new AssetAllocation(
                        startAllocations,
                        endAllocations,
                        glidePath
                    )

                    selectedInput = new Input(
                        input.id!,
                        new Date(input.birthday),
                        input.firstSignIn,
                        assetAllocations,
                        input.simulation!)

                    break;
                }
            }

            if (componentState) {
                componentState.setState({ input: selectedInput })
            }
        } catch (error) {
            console.error(error);
        }
        return selectedInput!;
    }

    static async createInputBranch(input: any) {
        try {
            await API.graphql(graphqlOperation(createInputs, { input: input }))
        } catch (err) {
            console.error('error creating event:', err)
        }
    }


}