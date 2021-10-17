import * as React from 'react';

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import {
  generateTable, fetchStartingBalances,
  fetchAccounts, fetchBudgets, fetchInputs,
  fetchEvents, fetchSimulations
} from '../utilities/helpers';

import Container from '@mui/material/Container';

import '../App.css';

import { Line } from "react-chartjs-2";

interface GraphsViewProps {
}

interface IState {
  selectedTab: number;
  events: Event[];
  budgets: Budget[];
  growth: number | null;
  inflation: number | null;
  absoluteMonthlyGrowth: number | null;
  startDate: Date | null;
  endDate: Date | null;
  dateIm59: Date | null;
  minEnd: number | null;
  retireDate: Date | null;
  accounts: Account[];
  balances: any;
}

class GraphsView extends React.Component<GraphsViewProps, IState> {

  constructor(props: GraphsViewProps) {

    super(props);

    this.state = {
      growth: null,
      inflation: null,
      absoluteMonthlyGrowth: null,
      startDate: null,
      endDate: null,
      dateIm59: null,
      retireDate: null,
      minEnd: null,
      selectedTab: 1,
      events: [],
      budgets: [],
      accounts: [],
      balances: {}
    }
    this.inputsAreLoaded = this.inputsAreLoaded.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetchSimulations(this).then((simulations) => {
      fetchBudgets(this, simulations);
      fetchEvents(this, simulations);
      fetchInputs(this, simulations);
    })
    fetchAccounts(this);
    fetchStartingBalances(this);
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  // subscribe to updates to Account/Budget/Event... regenerate chart when they change.

  inputsAreLoaded() {
    return this.state.growth != null && this.state.inflation != null && this.state.absoluteMonthlyGrowth != null;
  }

  render() {
    if (this.state.accounts.length > 0 && this.state.budgets.length > 0 && this.inputsAreLoaded() && this.state.events.length > 0) {
      const chartData = generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth!,
        this.state.accounts, this.state.startDate!, this.state.endDate!, this.state.dateIm59!, this.state.retireDate!, this.state.minEnd!);
      const options = {
        scales: {
          y: {
            beginAtZero: true,
            min: 0
          }
        }
      };
      return (
        <Container >
          <Line data={chartData} options={options} />
        </Container >
      );
    } else {
      return (<></>);
    }
  }
}

export default GraphsView;
