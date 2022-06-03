import * as React from 'react';

import { API, graphqlOperation } from 'aws-amplify'
import { createAccount, deleteAccount, updateAccount } from '../../graphql/mutations'
import { Account } from '../../model/Base/Account';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AccountDataAccess } from '../../utilities/AccountDataAccess';
import { Simulation } from '../../model/Base/Simulation';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import PercentIcon from '@mui/icons-material/Percent';
import InputAdornment from '@mui/material/InputAdornment';

interface AccountsViewProps {
  user: string;
  simulation: Simulation | undefined;
}

interface IState {
  accounts: Account[]
}

class AccountsView extends React.Component<AccountsViewProps, IState> {

  constructor(props: AccountsViewProps) {

    super(props);

    this.state = {
      accounts: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.handleSaveAccount = this.handleSaveAccount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.render = this.render.bind(this);
  }

  async componentDidMount() {
    if (this.props.simulation) {
      await AccountDataAccess.fetchAccountsForUserSelectedSim(this, this.props.simulation.getKey());
    }
  }

  async handleAddAccount() {
    try {
      let newAccount: any = new Account(new Date().getTime().toString(), '...', 0);
      newAccount['simulation'] = this.props.simulation!.id;

      let newAccounts = [...this.state.accounts, newAccount]
      this.setState({ accounts: newAccounts });
      await API.graphql(graphqlOperation(createAccount, { input: newAccount }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async handleDeleteAccount(event: any) {
    const idToDelete = (event.target as Element).id;
    if (window.confirm('Are you sure you want to DELETE this Account?')) {

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
  }

  async handleSaveAccount(e: any) {
    const id = e.target.id;

    try {
      const ipt = this.getAccountToSave(id);
      await API.graphql(graphqlOperation(updateAccount, { input: ipt! }));
    } catch (err) {
      console.log('error creating account:', err)
    }
  }

  handleAllocChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, account: Account, i: number) {

    try {
      const newValue = event.target.value;
      const accnt = this.state.accounts[i];
      accnt.contributionPercent = parseFloat(newValue);

      this.setState({ accounts:  this.state.accounts});
    } catch (e){
      console.warn(e)
    }

    
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    const tp = name.split('-')[0];
    const key = name.split('-')[1];
    const acnts = this.state.accounts;
    for (const account of acnts) {
      if (account.getKey() === key) {
        if (tp === 'account') {
          account.name = value;
        }
      }
    }
    this.setState({ accounts: acnts });

  }

  handleCheckBox(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const name = target.name;
    const tp = name.split('-')[0];
    const key = name.split('-')[1];
    const acnts = this.state.accounts;
    for (const account of acnts) {
      if (account.getKey() === key) {
        if (tp === 'account') {
          const old = account.taxAdvantaged;
          account.taxAdvantaged = old === 1 ? 0 : 1;
        }
      }
    }
    this.setState({ accounts: acnts });
  }

  getAccountToSave(id: string) {
    for (const i of this.state.accounts) {
      if (i.getKey() === id) {
        return i;
      }
    }
  }

  render() {
    if (this.props.simulation) {
      return (
        <Box >
          <h2>Accounts</h2>
          <Button style={{ width: "100%" }} onClick={this.handleAddAccount} variant="outlined">Add Account +</Button>
          {this.state.accounts ? this.state.accounts.map((account: Account, idx: number) => {
            return (
              <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                <CardContent>
                  <Stack direction='column' spacing={2}>
                  <Stack  direction='row' spacing={2}>
                  <TextField sx={{width: '60%'}} label="Account Name" id="outlined-basic" variant="outlined" name={`account-${account.getKey()}`} onChange={this.handleChange} value={account.name} />
                  <TextField sx={{width: '40%'}} label={'Contributon Allocation'} id="outlined-number" variant="outlined" onChange={(event) => this.handleAllocChange(event, account, idx)} InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <PercentIcon />
                                </InputAdornment>
                            ),
                        }} value={account.contributionPercent}></TextField>
                    </Stack>
                    <FormControlLabel control={<Checkbox name={`account-${account.getKey()}`} onChange={this.handleCheckBox} checked={account.taxAdvantaged === 1 ? true : false} />} label="Is this a tax advantaged account? (e.g. 401K, IRA)" />
                    <Button id={account.getKey()} onClick={this.handleDeleteAccount} variant="outlined">Delete</Button>
                    <Button id={account.getKey()} onClick={this.handleSaveAccount} variant="contained">Save</Button>
                  </Stack>

                </CardContent>
              </Card>
            );
          }) : <></>}
        </Box>
      )
    } else {
      return (
        <></>
      )
    }
  }
}
export default AccountsView;
