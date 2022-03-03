import * as React from 'react';

import { Event } from '../model/Base/Event';
import { Budget } from '../model/Base/Budget';
import { Account } from '../model/Base/Account';

import {
  generateData,
  generateGraphData, RowData
} from '../utilities/helpers';

import Container from '@mui/material/Container';
import { AccountDataAccess } from '../utilities/AccountDataAccess';

import '../App.css';

import { Line } from "react-chartjs-2";
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';
import { InputDataAccess } from '../utilities/InputDataAccess';
import { EventDataAccess } from '../utilities/EventDataAccess';
import { AssetDataAccess } from '../utilities/AssetDataAccess';
import LoadingButton from "@mui/lab/LoadingButton";

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
  chartData: any | null;
  successPercent: string;
  simulationButtonLoading: boolean;
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
      balances: {},
      chartData: null,
      successPercent: "0.0",
      simulationButtonLoading: false
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.runSimulations = this.runSimulations.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const simulations = await SimulationDataAccess.fetchSimulations(this);
    await BudgetDataAccess.fetchBudgets(this, simulations);
    await EventDataAccess.fetchEvents(this, simulations);
    await InputDataAccess.fetchInputs(this, simulations);
    await AccountDataAccess.fetchAccounts(this);
    await AssetDataAccess.fetchStartingBalances(this);
    const chartData = generateGraphData(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth!,
      this.state.accounts, this.state.startDate!, this.state.endDate!, this.state.dateIm59!, this.state.retireDate!, this.state.minEnd!);

    this.setState({ chartData: chartData });

  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  simulate(balances: any, events: any,
    budgets: any, absoluteMonthlyGrowth: any, accounts: any,
    startDate: any, endDate: any, dateIm59: any, retireDate: any,
    minEnd: any) {
    let numSuccess = 0;
    const STEPS = 200;
    for (let i = 0; i < STEPS; i += 1) {
      const results: RowData[] = generateData(balances, events,
        budgets, absoluteMonthlyGrowth, accounts,
        startDate, endDate, dateIm59, retireDate,
        minEnd);
      const end = parseInt(results[results.length - 1].brokerageBal.replace('$', ''));
      if (end > 0) {
        numSuccess += 1;
      }
    }
    const successP = ((numSuccess / STEPS) * 100.0).toFixed(2);
    return successP;
  }

  runSimulations() {
    this.setState({
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
      balances: {},
      chartData: null,
      successPercent: "0.0",
      simulationButtonLoading: true
    });
    this.getData();
    const res = this.simulate(this.state.balances, this.state.events,
      this.state.budgets, this.state.absoluteMonthlyGrowth!, this.state.accounts,
      this.state.startDate!, this.state.endDate!, this.state.dateIm59!, this.state.retireDate!,
      this.state.minEnd!);
    this.setState({ successPercent: res, simulationButtonLoading: false });
  }
  // subscribe to updates to Account/Budget/Event... regenerate chart when they change.

  render() {
    if (this.state.chartData) {
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
          <Line data={this.state.chartData} options={options} />
          <h2>{this.state.successPercent}%</h2>
          <LoadingButton loading={this.state.simulationButtonLoading} style={{ width: "100%" }} onClick={this.runSimulations} variant="outlined">Run Simulations</LoadingButton>
        </Container >
      );
    } else {
      return (<></>);
    }
  }
}

export default GraphsView;
