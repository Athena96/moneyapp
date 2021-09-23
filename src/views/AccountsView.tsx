import * as React from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';

// import '../App.css';
// import { Account } from '../model/Account';
import { Account } from '../model/Account';
import { Category } from '../model/Category';
// import { CategoryTypes } from "../API";

// import { getAccounts, getAccounts } from '../utilities/dataSetup';
// import { dateRange, generateTable } from '../utilities/helpers';
// import { Line } from "react-chartjs-2";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getAccounts } from '../utilities/dataSetup';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import TextField from '@mui/material/TextField';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createAccount, deleteAccount } from '../graphql/mutations'
import { listAccounts } from '../graphql/queries'
import { ListAccountsQuery, OnCreateAccountSubscription } from "../API";

import { GraphQLResult } from "@aws-amplify/api";

import awsExports from "../aws-exports";
Amplify.configure(awsExports);

interface AccountsViewProps {
    value: number;
    index: number;
}

interface IState {
  name: string,
  accounts: Account[]
}

class AccountsView extends React.Component<AccountsViewProps, IState> {

  constructor(props: AccountsViewProps) {
  
    super(props);

    this.state = {
      name: 'AccountsView',
      accounts: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.fetchAccounts = this.fetchAccounts.bind(this);

    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    this.fetchAccounts();
  }

  async fetchAccounts() {
    let fetchedAccounts: Account[] = [];
    try {
      const response = (await API.graphql({
        query: listAccounts
      })) as { data: ListAccountsQuery }
      for (const account of response.data.listAccounts!.items!) {
        fetchedAccounts.push(new Account(account!.id!, account!.name!));
      }
      this.setState({accounts: fetchedAccounts})
    } catch (error) {
      console.log(error);
    }
  }

  async handleAddAccount() {
    try {
      let newAccount = new Account('','...');
      let newAccounts = [...this.state.accounts, newAccount]
      this.setState({ accounts: newAccounts });
      await API.graphql(graphqlOperation(createAccount, {input: newAccount}))
    } catch (err) {
      console.log('error creating todo:', err)
    }

  }

  async handleDeleteAccount(event: any) {
    const idToDelete = (event.target as Element).id;
    let newAccounts = [];
    let accntToDelete = null;
    for (const account of this.state.accounts) {
      if (account.getKey() === idToDelete) {
        accntToDelete = {
          'id': account.getKey()
        }
        continue;
      } 
      newAccounts.push(account);

    }
    this.setState({ accounts: newAccounts });
    try {
      await API.graphql({ query: deleteAccount, variables: {input: accntToDelete}});
    } catch (err) {
      console.log('error:', err)
    }
  }

  render() {
    return this.props.index === this.props.value ? (
      <div >
        <Button style={{ margin: '15px', width: "100%" }} onClick={this.handleAddAccount} variant="outlined">Add Account</Button>

          {this.state.accounts.map((account: Account) => {
              return (

                <Card variant="outlined" style={{ margin: '15px' }}>
                <CardContent>
  
                  <Stack direction='row' spacing={4}>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                      {account.name}
                    </Typography>
  
       
                    <Button id={account.getKey()} onClick={this.handleDeleteAccount} variant="contained">Delete Account</Button>
  
                  </Stack>
                </CardContent>
              </Card>

              )
          })}
      </div>
    ) : (<></>);
  }

}

export default AccountsView;
