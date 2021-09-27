import * as React from 'react';

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import { getBudgets, getInputs } from '../utilities/dataSetup';
import { generateTable, fetchStartingBalances, fetchEventData, fetchAccounts } from '../utilities/helpers';

import Container from '@mui/material/Container';

import '../App.css';

import { Line } from "react-chartjs-2";

interface GraphsViewProps {
}

interface IState {
  selectedTab: number;
  events: Event[];
  budgets: Budget[];
  growth: number;
  inflation: number;
  absoluteMonthlyGrowth: number;
  startDate: Date;
  endDate: Date;
  dateIm59: Date;
  minEnd: number;
  retireDate: Date;
  accounts: Account[];
  balances: any;
}

class GraphsView extends React.Component<GraphsViewProps, IState> {

  constructor(props: GraphsViewProps) {

    super(props);

    const inputs = getInputs();
    this.state = {
      growth: inputs.growth,
      inflation: inputs.inflation,
      absoluteMonthlyGrowth: inputs.absoluteMonthlyGrowth,
      startDate: inputs.startDate,
      endDate: inputs.endDate,
      dateIm59: inputs.dateIm59,
      retireDate: inputs.retireDate,
      minEnd: inputs.minEnd,
      selectedTab: 1,
      events: [],
      budgets: getBudgets(),
      accounts: [],
      balances: {
        brokerage: {
          [0]: 0,

        },
        tax: {
          [0]: 0,
        }
      }
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetchAccounts(this);
    fetchStartingBalances(this);
    fetchEventData(this);
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  // subscribe to updates to Account/Budget/Event... regenerate chart when they change.

  render() {
    if (this.state.accounts.length >= 1) {
      const [balanceData, chartData] = generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth,
        this.state.accounts, this.state.startDate, this.state.endDate, this.state.dateIm59, this.state.retireDate, this.state.minEnd);
      return (
        <Container >
          <Line data={chartData} />
        </Container >
      );
    } else {
      return (<></>);
    }
  }
}

export default GraphsView;
