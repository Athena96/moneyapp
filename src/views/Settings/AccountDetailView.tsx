import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { getAccount } from '../../graphql/queries'
import { updateAccount } from '../../graphql/mutations';
import { GetAccountQuery } from "../../API";
import awsExports from "../../aws-exports";

import { Account } from '../../model/Base/Account';

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

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.fetchAccount = this.fetchAccount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.fetchAccount(window.location.pathname.split('/')[2])
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const accnt = this.state.account!;
    accnt!.name = value;
    this.setState({ account: accnt });
  }

  async handleSave() {
    try {
      await API.graphql(graphqlOperation(updateAccount, { input: this.state.account }))
    } catch (err) {
      console.log('error creating account:', err)
    }
  }

  async fetchAccount(accountId: string) {
    try {
      const ee = await API.graphql({ query: getAccount, variables: { id: accountId } }) as { data: GetAccountQuery }
      const e = ee.data!.getAccount!;
      const account = new Account(e!.id!, e!.name!, e.taxAdvantaged || 0, e?.contributionPercent || 0.0);
      this.setState({ account: account });
    } catch (err) {
      console.log('error:', err)
    }
  }


  render() {
    return (
      <div>
        <Container sx={{ marginTop: '55px' }} maxWidth="sm">
          <h2><b>Account</b></h2>

          <Stack spacing={2}>
            <TextField id="outlined-basic" name="name" variant="outlined" onChange={this.handleChange} value={this.state.account?.name!} />
            <Button id={this.state.account?.getKey()} onClick={this.handleSave} variant="contained">Save</Button>
          </Stack>
        </Container>

      </div>
    );
  }
}

export default AccountDetailView;