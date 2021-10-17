import * as React from 'react';

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import {
  generateGraphData, fetchStartingBalances
} from '../utilities/helpers';

import Container from '@mui/material/Container';
import { AccountDataAccess } from '../utilities/AccountDataAccess';

import '../App.css';

import { Line } from "react-chartjs-2";
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';
import { InputDataAccess } from '../utilities/InputDataAccess';
import { EventDataAccess } from '../utilities/EventDataAccess';

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
    SimulationDataAccess.fetchSimulations(this).then((simulations) => {
      BudgetDataAccess.fetchBudgets(this, simulations);
      EventDataAccess.fetchEvents(this, simulations);
      InputDataAccess.fetchInputs(this, simulations);
    })
    AccountDataAccess.fetchAccounts(this);
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
      const chartData = generateGraphData(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth!,
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
