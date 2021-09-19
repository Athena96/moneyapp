import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import './App.css';
import { Event } from './model/Event';
import { Budget } from './model/Budget';
import { Account } from './model/Account';

import { getEvents, getBudgets } from './utilities/dataSetup';
import { generateTable } from './utilities/helpers';
import { Line } from "react-chartjs-2";
import AccountsView from './views/AccountsView';
import BudgetsView from './views/BudgetsView';
import DataView from './views/DataView';
import InputsView from './views/InputsView';


interface IProps {
}

interface IState {
  selectedTab: number;
  today: Date;
  events: Event[];
  budgets: Budget[];
  growth: number;
  inflation: number;
  absoluteMonthlyGrowth: number;
  startDate: Date;
  endDate: Date;
  dateIm59 : Date;
  retireDate : Date;
  accounts: Account[];
  balances: any;
}

class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
  
    super(props);
    let n = new Date();
    let brokerage = new Account('brokerage');
    let tax = new Account('tax');
    let theaccounts: Account[] = [];
    theaccounts.push(brokerage);
    theaccounts.push(tax);

    this.state = {
      selectedTab: 0,
      today: n,
      events: getEvents(),
      budgets: getBudgets(),
      growth: 10.49,
      inflation: 2.75,
      absoluteMonthlyGrowth: ((10.49-2.75) / 100)/12,
      startDate: n,
      endDate: new Date('12/31/2096'),
      dateIm59:  new Date('4/25/2055'),
      retireDate: new Date('1/29/2024'),
      accounts: theaccounts,
      balances: {
        brokerage: {
          [0]: 199160.56,
          
        },
        tax: {
          [0]: 16362.42,
        }
      }
    }

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({selectedTab: newValue});
  }

  render() {
    const [balanceData, chartData] = generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth, 
      this.state.accounts, this.state.startDate, this.state.endDate, this.state.dateIm59, this.state.retireDate);
    return (
      <div >
        <div>
          <Line data={chartData} />

        </div>

        <br/><br/>

        <div>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={this.state.selectedTab} onChange={this.handleChange} aria-label="basic tabs example" variant="fullWidth" centered>
                <Tab label="Data"  />
                <Tab label="Budgets"  />
                <Tab label="Accounts"  />
                <Tab label="Inputs"  />
              </Tabs>
            </Box>
            <br/><br/>
            <DataView value={this.state.selectedTab} index={0} />
            <BudgetsView value={this.state.selectedTab} index={1} />
            <AccountsView value={this.state.selectedTab} index={2} />
            <InputsView value={this.state.selectedTab} index={3} />
          </Box>
        </div>
      </div>
    );
  }
}

export default App;
