import * as React from 'react';

import { Event } from '../model/Base/Event';
import { Budget } from '../model/Base/Budget';
import { Account } from '../model/Base/Account';

import {
  generateAssumeAvgData,
  generateData, getNormalDistributionOfReturns, getRandomHistoricalData, RowData
} from '../utilities/helpers';

import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Stack from '@mui/material/Stack';
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { AccountDataAccess } from '../utilities/AccountDataAccess';

import '../App.css';

import { Line, Bar } from "react-chartjs-2";
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';
import { InputDataAccess } from '../utilities/InputDataAccess';
import { EventDataAccess } from '../utilities/EventDataAccess';
import { AssetDataAccess } from '../utilities/AssetDataAccess';
import { getFinnhubClient } from '../utilities/helpers';
import { moneyGreen, moneyGreenLight, moneyGreenBoldText, black } from '../utilities/constants';
import { Tick } from 'chart.js';

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
  returnBarChartData: any | null;
  histBarChartData: any | null;
  chartDataTax: any | null;
  barChartData: any | null;
  successPercent: string;
  simulationButtonLoading: boolean;
  finnhubClient: any;
}

const STEPS = 500;

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
      chartDataTax: null,
      barChartData: null,
      returnBarChartData: null,
      histBarChartData: null,
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
        note: "avg",
        return: "",
        accountUsed: "",
      })
    }
    return newSim;
  }

  getSimStats(simulations: RowData[][], avgSim: RowData[]) {
    let newSimulations = [];
    newSimulations.push(this.getMaxScenario(simulations));
    newSimulations.push(this.getAvgScenario(simulations));
    newSimulations.push(avgSim);
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
    const avgSim = generateAssumeAvgData(this.state.balances, this.state.events,
      this.state.budgets, this.state.absoluteMonthlyGrowth!, this.state.accounts,
      this.state.startDate!, this.state.endDate!, this.state.dateIm59!, this.state.retireDate!,
      this.state.minEnd!);

    const simStats = this.getSimStats(sims, avgSim);
    const chartData = this.generateGraphData(simStats, 'brokerage');
    const barChartData = this.generateBarChartData(sims);
    const successPercent = this.getSuccessPercent(sims);
    const returnBarChartData = this.generateGausianReturnsBarChartData();
    const histBarChartData = this.generateHistoricalReturnsBarChartData();
    this.setState({ chartData: chartData, barChartData: barChartData, successPercent: successPercent, returnBarChartData: returnBarChartData, histBarChartData: histBarChartData });
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
    return simulations[0].note === 'avg'
  }

  //    getAvg(data:number[]) {
  //     var sum = 0.0;
  //     for (const datum of data) {
  //         sum += datum;
  //     }
  //     return sum/data.length;
  // }
  //   getMax(data:number[]) {
  //     var max = 0.0;
  //     for (const datum of data) {
  //         if (datum > max) {
  //             max = datum;
  //         }
  //     }
  //     return max;
  // }
  //   getMin(data:number[]) {
  //     var min = data[0];
  //     for (const datum of data) {
  //         if (datum < min) {
  //             min = datum;
  //         }
  //     }
  //     return min;
  // }
  generateHistoricalReturnsBarChartData() {
    const returns = getRandomHistoricalData(896, 'aggressive').map((v) => {
      return v * 100 * 12;
    });
    // console.log(`generateHistoricalReturnsBarChartData`)
    // console.log(`AVERAGE: ${this.getAvg(returns)}`);
    // console.log(`MAX: ${this.getMax(returns)}`);
    // console.log(`MIN: ${this.getMin(returns)}`);

    let returnsMap: any = {};
    for (const r of returns) {
      const roundedValue = Math.floor(r);
      Object.keys(returnsMap).includes(roundedValue.toString()) ? returnsMap[roundedValue] = returnsMap[roundedValue] + 1 : returnsMap[roundedValue] = 1;
    }
    const ksNums = Object.keys(returnsMap).map((k) => {
      return parseInt(k)
    });

    const orderedNumbs = ksNums.sort((n1, n2) => n1 - n2).map((v) => {
      return `${v}`
    });
    const data = {
      labels: orderedNumbs,
      datasets: [
        {
          label: 'hist dist returns',
          data: orderedNumbs.map((k) => {
            return returnsMap[k];
          }),
          backgroundColor: 'rgba(55, 117, 203, 0.75)',
        },
      ]
    };

    return data;
  }

  generateGausianReturnsBarChartData() {
    const returns = getNormalDistributionOfReturns(896, 7.5, 350)
    // console.log(`generateGausianReturnsBarChartData`)
    // console.log(`AVERAGE: ${this.getAvg(returns)}`);
    // console.log(`MAX: ${this.getMax(returns)}`);
    // console.log(`MIN: ${this.getMin(returns)}`);
    let returnsMap: any = {};
    for (const r of returns) {
      const roundedValue = Math.floor(r);
      Object.keys(returnsMap).includes(roundedValue.toString()) ? returnsMap[roundedValue] = returnsMap[roundedValue] + 1 : returnsMap[roundedValue] = 1;
    }
    const ksNums = Object.keys(returnsMap).map((k) => {
      return parseInt(k)
    });

    const orderedNumbs = ksNums.sort((n1, n2) => n1 - n2).map((v) => {
      return `${v}`
    });
    const data = {
      labels: orderedNumbs,
      datasets: [
        {
          label: 'normal dist returns',
          data: orderedNumbs.map((k) => {
            return returnsMap[k];
          }),
          backgroundColor: 'rgba(55, 117, 203, 0.75)',
        },
      ]
    };

    return data;
  }

  generateBarChartData(simulations: RowData[][]) {
    const Keys: any = {
      'lose': 'lose',
      'six': '>0-600K',
      'oneM': '600K-1M',
      'fiveM': '1M-5M',
      'tenM': '5M-10M',
      'twentyM': '10M-20M',
      'fortyM': '20M-40M',
      'greaterThanFortyM': '>40m',
    }
    const buckets: any = {}
    for (const simulation of simulations) {
      const endingBrokVal = parseInt(simulation[simulation.length - 1].brokerageBal.replace('$', ''))
      if (endingBrokVal <= 0) {
        Object.keys(buckets).includes(Keys.lose) ? buckets[Keys.lose] += 1 : buckets[Keys.lose] = 1;
      } else if (endingBrokVal > 0 && endingBrokVal <= 600000) {
        Object.keys(buckets).includes(Keys.six) ? buckets[Keys.six] += 1 : buckets[Keys.six] = 1;

      } else if (endingBrokVal > 600000 && endingBrokVal <= 1000000) {
        Object.keys(buckets).includes(Keys.oneM) ? buckets[Keys.oneM] += 1 : buckets[Keys.oneM] = 1;

      } else if (endingBrokVal > 1000000 && endingBrokVal <= 5000000) {
        Object.keys(buckets).includes(Keys.fiveM) ? buckets[Keys.fiveM] += 1 : buckets[Keys.fiveM] = 1;

      } else if (endingBrokVal > 5000000 && endingBrokVal <= 10000000) {
        Object.keys(buckets).includes(Keys.tenM) ? buckets[Keys.tenM] += 1 : buckets[Keys.tenM] = 1;

      } else if (endingBrokVal > 10000000 && endingBrokVal <= 20000000) {
        Object.keys(buckets).includes(Keys.twentyM) ? buckets[Keys.twentyM] += 1 : buckets[Keys.twentyM] = 1;

      } else if (endingBrokVal > 20000000 && endingBrokVal <= 40000000) {
        Object.keys(buckets).includes(Keys.fortyM) ? buckets[Keys.fortyM] += 1 : buckets[Keys.fortyM] = 1;

      } else if (endingBrokVal > 40000000) {
        Object.keys(buckets).includes(Keys.greaterThanFortyM) ? buckets[Keys.greaterThanFortyM] += 1 : buckets[Keys.greaterThanFortyM] = 1;
      }
    }

    const ks = Object.keys(Keys).map((k) => {
      return Keys[k];
    });
    const data = {
      labels: ks,
      datasets: [
        {
          label: 'count of portfolio endings',
          data: Object.keys(Keys).map((k) => {
            return buckets[Keys[k]];
          }),
          backgroundColor: Object.keys(Keys).map((k) => {
            return k === 'lose' ? 'rgba(255, 0, 0, 0.75)' : k === 'six' ? 'rgba(255,204,0,1)' : 'rgba(55, 117, 203, 0.75)'
          }),
        },
      ]
    };

    return data;
  }


  generateGraphData(simulations: RowData[][], account: string) {
    var chartData: any = {
      labels: [],
      datasets: []
    }

    let j = 0
    let iter = 0;
    const names = [
      'Best Scenario',
      'Average of all Scenarios',
      'Linear Growth Assumption',
      'Worst Scenario'
    ]
    for (const simulation of simulations) {
      if (iter === 0) {
        simulation.forEach((dataRow, i) => {
          chartData.labels.push(`${dataRow.date}`);
        });
      }

      account === 'brokerage' ? chartData.datasets.push({
        label: simulation[0].note === 'AVERAGE' ? names[2] : this.isAvg(simulation) ? names[1] : names[iter],
        data: [],
        borderColor: this.isAvg(simulation) ? "rgba(255,204,0,1)" : this.endedSuccessFully(simulation, 'brokerageBal') ? "rgba(37,113,207,1)" : "rgba(255,0,0,1)",
        pointBorderWidth: 1,
        pointRadius: 1,
      }) : chartData.datasets.push({
        label: this.isAvg(simulation) ? `avg_tax_${iter}` : `sim_tax_${iter}`,
        data: [],
        borderColor: this.isAvg(simulation) ? "rgba(255,204,0,1)" : this.endedSuccessFully(simulation, 'taxBal') ? "rgba(0,125,76,1)" : "rgba(255,0,0,1)",
        pointBorderWidth: 1,
        pointRadius: 1,
      });

      // eslint-disable-next-line no-loop-func
      simulation.forEach((dataRow, i) => {
        account === 'brokerage' ? chartData.datasets[j].data.push(Number(dataRow.brokerageBal.replace('$', ''))) : chartData.datasets[j].data.push(Number(dataRow.taxBal.replace('$', '')));
      });
      j += 1;
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
    const avgSim = generateAssumeAvgData(this.state.balances, this.state.events,
      this.state.budgets, this.state.absoluteMonthlyGrowth!, this.state.accounts,
      this.state.startDate!, this.state.endDate!, this.state.dateIm59!, this.state.retireDate!,
      this.state.minEnd!)
    const simStats = this.getSimStats(sims, avgSim);
    const charts = this.generateGraphData(simStats, 'brokerage');
    const chartDataTax = this.generateGraphData(simStats, 'tax');

    const successPercent = this.getSuccessPercent(sims);
    this.setState({ chartData: charts, chartDataTax: chartDataTax, successPercent: successPercent, simulationButtonLoading: false });
  }
  // subscribe to updates to Account/Budget/Event... regenerate chart when they change.

  render() {
    const options = {
      scales: {
        y: {
          min: -20000000,
          max: 20000000,
          ticks: {
            callback: function (tickValue: string | number, index: number, ticks: Tick[]) {
              if ((tickValue as number ) >= 1000000) {
                return '$' + (tickValue as number )/ 1000000 + ' M'
              } else if ((tickValue as number ) <= -1000000) {
                return '$' + (tickValue as number ) / 1000000 + ' M'
              } else {
                return '$' + (tickValue as number );
              }
            }
          }
        },
        x: {
          display: false
        }

      },
      plugins: {
        legend: {
          position: "left" as const,
          maxHeight: 10
        },
        title: {
          display: true,
          text: 'Monte Carlo Simulations',
        },
      }
    };
    const barOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Portfolio Ending Balances',
        },
      },
    };
    return (
      <Container >
        {this.state.chartData && this.state.barChartData ? <>
          <Stack direction='column' >


            <Paper component="span" sx={{ maxWidth: '95%', marginTop: 2, p: 1, backgroundColor: moneyGreenLight }}>
              <h3 style={{ color: black, width: 'min-width' }}>Chance of Success <Tooltip title={`Calculated using Monte Carlo, running ${STEPS} different simulations. This is the probability that you won't run out of money before you die.`}><InfoIcon /></Tooltip></h3>
              <h2 style={{ color: moneyGreenBoldText }}>{this.state.successPercent}%</h2>
              <Paper variant="outlined" >
                <Line data={this.state.chartData} options={options} />
              </Paper >
            </Paper>

            <Paper component="span" sx={{ maxWidth: '95%', marginTop: 2, p: 1, backgroundColor: moneyGreenLight }}>
              <h3 style={{ color: black, width: 'min-width' }}>Ending Balances</h3>
              <Paper variant="outlined" >
                <Bar options={barOptions} data={this.state.barChartData} />
              </Paper >
            </Paper>

            <br />
            {/* <Accordion >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Gaussian distribution of returns</Typography>
            </AccordionSummary>

            <Bar options={barOptions} data={this.state.returnBarChartData} />
          </Accordion > */}
            <br />

            {/* <Bar options={barOptions} data={this.state.histBarChartData} /> */}
          </Stack>

          {/* <LoadingButton loading={this.state.simulationButtonLoading} style={{ width: "100%" }} onClick={this.runSimulations} variant="outlined">Run Simulations</LoadingButton> */}
        </> : < >
          <CircularProgress />
        </>
        }
      </Container >
    );
  }
}

export default GraphsView;
