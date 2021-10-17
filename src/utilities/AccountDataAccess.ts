
import { Account } from '../model/Base/Account';
import { ListAccountsQuery } from "../API";
import { API } from 'aws-amplify'
import { listAccounts } from '../graphql/queries'

export class AccountDataAccess {

    static async fetchAccounts(componentState: any) {
        let fetchedAccounts: Account[] = [];
        try {
            const response = (await API.graphql({
                query: listAccounts
            })) as { data: ListAccountsQuery }
            for (const account of response.data.listAccounts!.items!) {
                fetchedAccounts.push(new Account(account!.id!, account!.name!));
            }
            componentState.setState({ accounts: fetchedAccounts })
        } catch (error) {
            console.log(error);
        }
    }

}