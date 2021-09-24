import * as React from 'react';



import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createAccount, deleteAccount } from '../../graphql/mutations'
import { getAccount, listAccounts } from '../../graphql/queries'
import { GetAccountQuery, ListAccountsQuery, OnCreateAccountSubscription } from "../../API";
import { Account } from '../../model/Account';
import { GraphQLResult } from "@aws-amplify/api";
// import {
//   BrowserRouter as Router,
//   Link,
//   Route
// } from 'react-router-dom'
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';

import awsExports from "../../aws-exports";
import { getAccounts } from '../../utilities/dataSetup';
import { Category } from '../../model/Category';


import Button from '@mui/material/Button';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

Amplify.configure(awsExports);

interface AccountDetailProps {
}


interface IState {
  account: Account | null;
}
class AccountDetailView extends React.Component<AccountDetailProps, IState> {
  constructor(props: AccountDetailProps) {
    super(props);
    this.state = {
      account: null
    }

    this.handleSave = this.handleSave.bind(this);
    this.fetchAccount = this.fetchAccount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {

    this.fetchAccount(window.location.pathname.split('/')[2])
  }

  handleSave() {

  }

  async fetchAccount(accountId: string) {

    console.log(accountId);
    try {
      const ee = await API.graphql({ query: getAccount, variables: { id: accountId } }) as { data: GetAccountQuery }
      const e = ee.data!.getAccount!;
      const account = new Account(e!.id!, e!.name!)

      this.setState({ account: account });
    } catch (err) {
      console.log('error:', err)
    }

  }


  render() {
    return (
      <div>
        <Container sx={{ marginTop: '55px' }} maxWidth="sm">
          <Stack spacing={2}>
            <p><b><b>name</b></b></p>
            <TextField id="outlined-basic" variant="outlined" value={this.state.account?.name ? this.state.account?.name : '...'} />
            
            <Button id={this.state.account?.getKey()} onClick={this.handleSave} variant="contained">Save</Button>

          </Stack>
        </Container>

      </div>
    );
  }
}

export default AccountDetailView;