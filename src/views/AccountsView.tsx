import * as React from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';

// import '../App.css';
// import { Account } from '../model/Account';
import { Account } from '../model/Account';
import { Category } from '../model/Category';
// import { CategoryTypes } from '../model/Category';

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
      accounts: getAccounts()
    }
    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.render = this.render.bind(this);
  }

  handleAddAccount() {
    let emptarr: Category[] = [];
    let newAccount = new Account('...');
    let newAccounts = [...this.state.accounts, newAccount]
    this.setState({ accounts: newAccounts });
  }

  handleDeleteAccount(event: any) {
    const idToDelete = (event.target as Element).id;
    let newAccounts = [];
    for (const budget of this.state.accounts) {
      if (budget.getKey() !== idToDelete) {
        newAccounts.push(budget);
      }
    }
    this.setState({ accounts: newAccounts });
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
