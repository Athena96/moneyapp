import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createAccount, deleteAccount } from '../graphql/mutations'
import awsExports from "../aws-exports";

import { Account } from '../model/Base/Account';
// import { fetchAccounts } from '../utilities/helpers';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from "react-router-dom";
import { AccountDataAccess } from '../utilities/AccountDataAccess';

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
    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    AccountDataAccess.fetchAccounts(this);
  }

  async handleAddAccount() {
    try {
      let newAccount = new Account(new Date().getTime().toString(), '...');
      let newAccounts = [...this.state.accounts, newAccount]
      this.setState({ accounts: newAccounts });
      await API.graphql(graphqlOperation(createAccount, { input: newAccount }))
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
      await API.graphql({ query: deleteAccount, variables: { input: accntToDelete } });
    } catch (err) {
      console.log('error:', err)
    }
  }

  handleEditAccount(event: any) {
    console.log((event.target as Element).id);
  }

  render() {
    return this.props.index === this.props.value ? (
      <>
        <Button style={{ width: "100%" }} onClick={this.handleAddAccount} variant="outlined">Add Account</Button>

        {this.state.accounts.map((account: Account) => {
          return (

            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
              <CardContent>

                <Stack direction='row' spacing={4}>
                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    {account.name}
                  </Typography>
                </Stack>

                <CardActions>

                  <Stack direction='row' spacing={4}>
                    <Button id={account.getKey()} onClick={this.handleDeleteAccount} variant="outlined">Delete</Button>

                    <Link style={{ color: 'white', textDecoration: 'none' }} to={`/accounts/${account.getKey()}`}><Button id={account.getKey()} onClick={this.handleEditAccount} variant="contained">Edit</Button></Link>

                  </Stack>
                </CardActions>

              </CardContent>
            </Card>

          )
        })}
      </>
    ) : (<></>);
  }

}

export default AccountsView;
