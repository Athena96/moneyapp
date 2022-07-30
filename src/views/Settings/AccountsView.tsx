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
import { BudgetDataAccess } from '../../utilities/BudgetDataAccess';
import { Budget } from '../../model/Base/Budget';
import { getActiveBudgets } from '../../utilities/helpers';
import { CategoryTypes } from '../../API';
import { Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface AccountsViewProps {
  user: string;
  simulation: Simulation | undefined;
  isShownInSetup: boolean;
}

interface IState {
  accounts: Account[]
  accountsContributionPercents: string[] | undefined
  totalCurrentBudgetIncome: number | undefined
  totalCurrentBudgetExpenses: number | undefined
}

class AccountsView extends React.Component<AccountsViewProps, IState> {

  constructor(props: AccountsViewProps) {

    super(props);

    this.state = {
      accounts: [],
      accountsContributionPercents: undefined,
      totalCurrentBudgetIncome: undefined,
      totalCurrentBudgetExpenses: undefined
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
      const accounts = await AccountDataAccess.fetchAccountsForUserSelectedSim(this, this.props.simulation.getKey());
      const budgets = await BudgetDataAccess.fetchBudgetsForSelectedSim(this, this.props.simulation.getKey());
      const today = new Date();
      const currentBudgets = getActiveBudgets(today, budgets || [])
      const monthlySpending = currentBudgets.map((budget: Budget) => {
        return budget.type === CategoryTypes.Expense ? budget.getSum() : 0;
      }).reduce((prev, curr) => prev + curr, 0)
      const monthlyIncome = currentBudgets.map((budget: Budget) => {
        return budget.type === CategoryTypes.Income ? budget.getSum() : 0;
      }).reduce((prev, curr) => prev + curr, 0)

      const percents: string[] = []
      for (const account of accounts) {
        percents.push(account.contributionPercent.toFixed(2));
      }

      this.setState({ totalCurrentBudgetExpenses: monthlySpending, totalCurrentBudgetIncome: monthlyIncome, accountsContributionPercents: percents });

      if (accounts.length === 0) {
        await this.handleAddAccount();
      }
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
      console.error('error creating todo:', err)
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
        console.error('error:', err)
      }
    }
  }

  async handleSaveAccount(event: any, i: number) {

    let sum = 0;
    const percents = this.state.accountsContributionPercents;

    for (const p of percents!) {

      const pv = Math.round(Math.ceil(parseFloat(p)))
      sum += pv;
    }

    if (sum > 100 || sum < 0) {
      window.confirm('the allocation percents must add up to 100 or 0')
      return;
    }

    try {
      const ipt = this.state.accounts[i];
      ipt.contributionPercent = isNaN(parseFloat(this.state.accountsContributionPercents![i])) ? 0.0 : parseFloat(this.state.accountsContributionPercents![i]);
      await API.graphql(graphqlOperation(updateAccount, { input: ipt! }));
    } catch (err) {
      console.error('error creating account:', err)
    }
  }

  handleAllocChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, account: Account, i: number) {


    const newValue = event.target.value;
    const percents = this.state.accountsContributionPercents;
    percents![i] = newValue;


    this.setState({ accountsContributionPercents: percents });

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


  render() {
    if (this.props.simulation !== undefined && this.state.totalCurrentBudgetExpenses !== undefined && this.state.totalCurrentBudgetIncome !== undefined && this.state.accountsContributionPercents !== undefined) {
      const savings = this.state.totalCurrentBudgetIncome - this.state.totalCurrentBudgetExpenses;
      return (
        <Box >
          <h2>Accounts</h2>
          {this.state.accounts ? this.state.accounts.map((account: Account, idx: number) => {
            const cpv = this.state.accountsContributionPercents![idx]
            let cp = isNaN(parseFloat(cpv)) ? 0.0 : parseFloat(cpv) / 100;

            return (
              <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                <CardContent>
                  <Stack direction='column' spacing={2}>
                    <Stack direction='row' spacing={2}>
                      {this.props.isShownInSetup ?
                        <TextField sx={{ width: '100%' }} label="Account Name" id="outlined-basic" variant="outlined" name={`account-${account.getKey()}`} onChange={this.handleChange} value={account.name} /> :
                        <><h2 style={{ marginLeft: '10px' }}>{account.name}</h2></>}
                    </Stack>
                    <Stack direction='row' spacing={2}>
                      <TextField sx={{ width: '100%' }} label={'Contribution Allocation'} id="outlined-number" variant="outlined" onChange={(event) => this.handleAllocChange(event, account, idx)} InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PercentIcon />
                          </InputAdornment>
                        ),
                      }} value={this.state.accountsContributionPercents![idx]}></TextField>


                      {this.props.isShownInSetup === false && <p style={{ marginTop: '12px' }}><b>${(cp * savings).toFixed(2)}</b> of ${savings.toFixed(2)}</p>}
                      <Tooltip title={`Of the money you're saving each month, what percent is going to this account? If you're not sure, you can always come back and add it later.`}><InfoIcon /></Tooltip>
                    </Stack>
                    <FormControlLabel control={<Checkbox name={`account-${account.getKey()}`} onChange={this.handleCheckBox} checked={account.taxAdvantaged === 1 ? true : false} />} label="Is this a tax advantaged account? (e.g. 401K, IRA)" />
                    <Button id={account.getKey()} onClick={this.handleDeleteAccount} variant="outlined">Delete</Button>
                    <Button id={account.getKey()} onClick={(event) => this.handleSaveAccount(event, idx)} variant="contained">Save</Button>
                  </Stack>

                </CardContent>
              </Card>
            );
          }) : <></>}
          <br />
          <Button style={{ width: "100%" }} onClick={this.handleAddAccount} variant="outlined">Add Account +</Button>
          <br />
          <br />
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
