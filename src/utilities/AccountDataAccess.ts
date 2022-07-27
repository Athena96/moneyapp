
import { Account } from '../model/Base/Account';
import { ListAccountsQuery } from "../API";
import { API, graphqlOperation } from 'aws-amplify'
import { listAccounts } from '../graphql/queries'
import { createAccount } from '../graphql/mutations';

export class AccountDataAccess {

    static async fetchAccountsForUserSelectedSim(componentState: any, userSimulation: string): Promise<Account[]> {
        let fetchedAccounts: Account[] = [];
        try {
            const response = (await API.graphql({
                query: listAccounts
            })) as { data: ListAccountsQuery }
            for (const account of response.data.listAccounts!.items!) {
                if (account?.simulation === userSimulation) {
                    fetchedAccounts.push(new Account(account!.id!, account!.name!, account.taxAdvantaged || 0, account?.contributionPercent || 0.0));
                }
            }

            if (componentState) {
                componentState.setState({ accounts: fetchedAccounts })
            }
        } catch (error) {
            console.error(error);
        }

        return fetchedAccounts;
    }

    static async createAccountBranch(account: any) {
        try {
          await API.graphql(graphqlOperation(createAccount, { input: account }))
        } catch (err) {
          console.error('error creating event:', err)
        }
      }

}