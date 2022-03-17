import * as React from 'react';

import { Event } from '../model/Base/Event';
import { Budget } from '../model/Base/Budget';
import { Account } from '../model/Base/Account';

import {
  generateData, RowData
} from '../utilities/helpers';

import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import { AccountDataAccess } from '../utilities/AccountDataAccess';

import '../App.css';

import { Line } from "react-chartjs-2";
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';
import { InputDataAccess } from '../utilities/InputDataAccess';
import { EventDataAccess } from '../utilities/EventDataAccess';
import { AssetDataAccess } from '../utilities/AssetDataAccess';
import { getFinnhubClient } from '../utilities/helpers';

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
  finnhubClient: any;
}

const STEPS = 300;

class GraphsView extends React.Component<GraphsViewProps, IState> {

  constructor(props: GraphsViewProps) {

    super(props);

    const finnhubClient = getFinnhubClient();

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
      simulationButtonLoading: false,
      finnhubClient: finnhubClient
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

  getMaxScenario(simulations: RowData[][]) {
    let maxBal = 0;
    let maxBalIndex = 0;
    let i = 0;
    for (const simulation of simulations) {
      const endingBal = parseInt(simulation[simulations.length - 1].brokerageBal.replace('$', ''))
      if (endingBal > maxBal) {
        maxBalIndex = i;
        maxBal = endingBal;
      }
      i += 1;
    }

    return simulations[maxBalIndex];
  }
  getMinScenario(simulations: RowData[][]) {
    let minBal = 0;
    let minBalIndex = 0;
    let i = 0;
    for (const simulation of simulations) {
      const endingBal = parseInt(simulation[simulations.length - 1].brokerageBal.replace('$', ''))
      if (i === 0) {
        minBal = endingBal;
      }

      if (endingBal < minBal) {
        minBalIndex = i;
        minBal = endingBal;
      }
      i += 1;
    }
    return simulations[minBalIndex];
  }

  getAvgScenario(simulations: RowData[][]): RowData[] {
    let newSim = []
    for (let colIdx = 0; colIdx < simulations[0].length; colIdx += 1) {
      let brokerageBalSum = 0.0;
      let taxBalSum = 0.0;
      let dt = simulations[0][colIdx].date
      for (const simulation of simulations) {
        brokerageBalSum += parseFloat(simulation[colIdx].brokerageBal.replace('$', ''));
        taxBalSum += parseFloat(simulation[colIdx].taxBal.replace('$', ''));
      }
      const brokerageAvg = brokerageBalSum / simulations.length
      const taxAvg = taxBalSum / simulations.length
      const sum = brokerageAvg + taxAvg;
      newSim.push({
        date: dt,
        brokerageBal: brokerageAvg.toFixed(2) + "",
        taxBal: taxAvg.toFixed(2) + "",
        sum: sum + "",
        note: "tax",
        return: "",
        accountUsed: "",
      })
    }
    return newSim;
  }

  getSimStats(simulations: RowData[][]) {
    let newSimulations = [];
    newSimulations.push(this.getMaxScenario(simulations));
    newSimulations.push(this.getAvgScenario(simulations));
    newSimulations.push(this.getMinScenario(simulations));
    return newSimulations;
  }

  async getData() {
    const simulations = await SimulationDataAccess.fetchSimulations(this);
    await BudgetDataAccess.fetchBudgets(this, simulations);
    await EventDataAccess.fetchEvents(this, simulations, this.state.finnhubClient);
    await InputDataAccess.fetchInputs(this, simulations);
    await AccountDataAccess.fetchAccounts(this);
    await AssetDataAccess.fetchStartingBalances(this, this.state.finnhubClient);
    const sims = this.simulate(this.state.balances, this.state.events,
      this.state.budgets, this.state.absoluteMonthlyGrowth!, this.state.accounts,
      this.state.startDate!, this.state.endDate!, this.state.dateIm59!, this.state.retireDate!,
      this.state.minEnd!);
    const simStats = this.getSimStats(sims);
    const chartData = this.generateGraphData(simStats);
    const successPercent = this.getSuccessPercent(sims);
    this.setState({ chartData: chartData, successPercent: successPercent });
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  simulate(balances: any, events: any,
    budgets: any, absoluteMonthlyGrowth: any, accounts: any,
    startDate: any, endDate: any, dateIm59: any, retireDate: any,
    minEnd: any) {
    const setOfSimulations: RowData[][] = [];
    for (let i = 0; i < STEPS; i += 1) {
      setOfSimulations.push(generateData(balances, events,
        budgets, absoluteMonthlyGrowth, accounts,
        startDate, endDate, dateIm59, retireDate,
        minEnd));
    }
    return setOfSimulations;
  }

  endedSuccessFully(results: RowData[], account: string) {
    return parseInt(account === "taxBal" ?
      results[results.length - 1].taxBal.replace('$', '') :
      results[results.length - 1].brokerageBal.replace('$', '')) > 0;
  }

  getSuccessPercent(simulations: RowData[][]) {
    let numSuccess = 0.0;
    for (const simulation of simulations) {
      if (this.endedSuccessFully(simulation, 'brokerageBal')) {
        numSuccess += 1;
      }
    }
    return ((numSuccess / simulations.length) * 100).toFixed(2);
  }
  isAvg(simulations: RowData[]) {
    return simulations[0].note === 'tax'
  }

  generateGraphData(simulations: RowData[][]) {
    var chartData: any = {
      labels: [],
      datasets: []
    }

    let j = 0
    let iter = 0;
    for (const simulation of simulations) {
      if (iter === 0) {
        simulation.forEach((dataRow, i) => {
          chartData.labels.push(`${dataRow.date}`);
        });
      }
      chartData.datasets.push({
        label: this.isAvg(simulation) ? `avg_brok_${iter}` : `sim_brok_${iter}`,
        data: [],
        borderColor: this.isAvg(simulation) ? "rgba(30,30,30,1)" : this.endedSuccessFully(simulation, 'brokerageBal') ? "rgba(37,113,207,1)" : "rgba(255,0,0,1)",
        pointBorderWidth: 1,
        pointRadius: 1,
      });
      chartData.datasets.push({
        label: this.isAvg(simulation) ? `avg_tax_${iter}` : `sim_tax_${iter}`,
        data: [],
        borderColor: this.isAvg(simulation) ? "rgba(30,30,30,1)" : this.endedSuccessFully(simulation, 'taxBal') ? "rgba(0,125,76,1)" : "rgba(255,0,0,1)",
        pointBorderWidth: 1,
        pointRadius: 1,
      });

      // eslint-disable-next-line no-loop-func
      simulation.forEach((dataRow, i) => {
        chartData.datasets[j].data.push(Number(dataRow.brokerageBal.replace('$', '')));
        chartData.datasets[j + 1].data.push(Number(dataRow.taxBal.replace('$', '')));
      });
      j += 2;
      iter += 1;
    }
    return chartData;
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
    const sims = this.simulate(this.state.balances, this.state.events,
      this.state.budgets, this.state.absoluteMonthlyGrowth!, this.state.accounts,
      this.state.startDate!, this.state.endDate!, this.state.dateIm59!, this.state.retireDate!,
      this.state.minEnd!);
    const simStats = this.getSimStats(sims);
    const charts = this.generateGraphData(simStats);
    const successPercent = this.getSuccessPercent(sims);
    this.setState({ chartData: charts, successPercent: successPercent, simulationButtonLoading: false });
  }
  // subscribe to updates to Account/Budget/Event... regenerate chart when they change.

  render() {
    const options = {
      scales: {
        y: {
          // beginAtZero: true,
          // min: 0
        }
      }
    };
    return (
      <Container >
        {this.state.chartData ? <>
          <Line data={this.state.chartData} options={options} />
          <h2 style={{ width: 'min-width' }}>{this.state.successPercent}% <Tooltip title="Probability of portfolio success (using Monte Carlo Simulations)"><InfoIcon /></Tooltip></h2>

          {/* <LoadingButton loading={this.state.simulationButtonLoading} style={{ width: "100%" }} onClick={this.runSimulations} variant="outlined">Run Simulations</LoadingButton> */}
        </> : < >
          <CircularProgress />
        </>}
      </Container >
    );
  }
}

export default GraphsView;
