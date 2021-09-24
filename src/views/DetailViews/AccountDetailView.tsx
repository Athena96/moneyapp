import * as React from 'react';

import Amplify, { API } from 'aws-amplify'
import { getAccount } from '../../graphql/queries'
import { GetAccountQuery } from "../../API";
import awsExports from "../../aws-exports";

import { Account } from '../../model/Account';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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