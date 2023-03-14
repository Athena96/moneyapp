import * as React from 'react';

import {
  getMonteCarloProjection,
  MonteCarloRowData
} from '../../utilities/helpers';
import RefreshIcon from '@mui/icons-material/Refresh';

import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import '../../App.css';
import { Line } from "react-chartjs-2";
import { moneyGreenBoldText, black } from '../../utilities/constants';
import { Tick } from 'chart.js';
import { Simulation } from '../../model/Base/Simulation';
import Box from '@mui/material/Box';
// import CircularProgress from '@mui/material/CircularProgress';
import AssetViewComponent from './components/AssetViewComponent';

import { MonteCarloData } from "montecarlo-lib"

import DataView from './DataView';
interface DashboardViewProps {
  user: string;
  simulation: Simulation | undefined;
}

interface IState {
  selectedTab: number;
  chartData: any | null;
  lastComputed: number | null;
  successPercent: string;
  simulationButtonLoading: boolean;
  chartDataRaw: MonteCarloRowData[] | undefined;
  timeout: number;
  balanceData: number[]
}

class DashboardView extends React.Component<DashboardViewProps, IState> {

  constructor(props: DashboardViewProps) {
    super(props);
    this.state = {
      chartDataRaw: undefined,
      selectedTab: 1,
      chartData: null,
      lastComputed: null,
      successPercent: "0.0",
      timeout: 5000,
      simulationButtonLoading: false,
      balanceData: []
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTriggerSimulation = this.handleTriggerSimulation.bind(this);
  }

  async componentDidMount() {
    await this.handleTriggerSimulation();
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  async handleTriggerSimulation() {
    const monteCarloData = await getMonteCarloProjection(this.props.simulation!.getKey())
    const successPercentString = `${monteCarloData.successPercent.toFixed(2)}`
    const chartData = this.generateGraphData(monteCarloData);
    this.setState({ chartData, successPercent: successPercentString, balanceData: monteCarloData.medianLine })
  }

  generateGraphData(simulationData: MonteCarloData) {
    var chartData: any = {
      labels: [],
      datasets: []
    }


    const moneyGreen = 'rgba(90,209,171,1)'
    const names = [
      // {
      //   name: 'Best Scenario',
      //   color: blue,
      //   key: 'maxBalance'
      // },
      {
        name: 'Average of all Scenarios Brok',
        color: moneyGreen,
        key: 'assumedAvgBalanceBrok'
      },
      // {
      //   name: 'Average of all Scenarios Tax',
      //   color: blue,
      //   key: 'assumedAvgBalanceTax'
      // }
      // {
      //   name: 'Worst Scenario',
      //   color: red,
      //   key: 'minBalance'
      // }
    ]

    // add date labels
    simulationData.medianLine.forEach((dataRow, i) => {
      chartData.labels.push(`${i}`);
    });

    let j = 0;
    for (const name of names) {
      chartData.datasets.push({
        label: name.name,
        data: [],
        borderColor: name.color,
        pointBorderWidth: 1,
        pointRadius: 1,
      })
      // eslint-disable-next-line no-loop-func
      simulationData.medianLine.forEach((dataRow, i) => {
        if (name.key === 'maxBalance') {
          // chartData.datasets[j].data.push(Number(dataRow.maxBalance.replace('$', '')))
        } else if (name.key === 'avgBalance') {
          // chartData.datasets[j].data.push(Number(dataRow.avgBalance.replace('$', '')))
        } else if (name.key === 'minBalance') {
          // chartData.datasets[j].data.push(Number(dataRow.minBalance.replace('$', '')))
        } else if (name.key === 'assumedAvgBalanceBrok') {
          chartData.datasets[j].data.push(dataRow)
        }

      });
      j += 1;

    }
    return chartData;
  }

  getMax() {
    if (this.state.chartDataRaw) {
      let max = 0.0
      for (const dir of this.state.chartDataRaw || []) {
        const tax = parseFloat(dir.assumedAvgBalanceTax);
        const brok = parseFloat(dir.assumedAvgBalanceBrok);
        const maxBetweenAccnts = Math.max(tax, brok);
        if (maxBetweenAccnts > max) {
          max = maxBetweenAccnts;
        }
      }
      let nextMill = Math.round((max + 1000000) / 1000000) * 1000000;
      return Math.round(nextMill);
    }
    return 0;
  }

  render() {
    const isMobile = window.innerWidth <= 399;
    // const max = this.getMax();
    const options = {
      scales: {
        y: {
          min: 0,
          max: 10_000_000,
          ticks: {
            callback: function (tickValue: string | number, index: number, ticks: Tick[]) {
              if ((tickValue as number) >= 1000000) {
                return '$' + (tickValue as number) / 1000000 + ' M'
              } else if ((tickValue as number) <= -1000000) {
                return '$' + (tickValue as number) / 1000000 + ' M'
              } else {
                return '$' + (tickValue as number);
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
          position: "bottom" as const,
          display: isMobile ? false : true,
        },
        title: {
          display: true,
          text: 'Monte Carlo Simulations',
        },
      }
    };

    // add more quote data: https://finnhub.io/docs/api/quote

    if (this.props.simulation) {
      return (
        <Box >
          {this.state.chartData ? <>
            <h1 >Dashboard</h1>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
              <Paper variant="outlined" sx={{ width: isMobile ? '100%' : '75%', p: 2, }} >
                <h3 style={{ color: black, width: 'min-width' }}>Chance of Success <Tooltip title={`Calculated using Monte Carlo, running 1,000 different simulations. This is the probability that you won't run out of money before you die.`}><InfoIcon /></Tooltip></h3>
                <h2 style={{ color: moneyGreenBoldText }}>{this.state.successPercent}%</h2>
                <Paper  >
                  {/* https://apexcharts.com/react-chart-demos/line-charts/zoomable-timeseries/ */}
                  <Line data={this.state.chartData} options={options} />
                  {this.state.simulationButtonLoading ? <Box ><small >Running 1,000 different Monte Carlo Simulations, this may take a moment... </small></Box> : <IconButton onClick={this.handleTriggerSimulation} color="primary" aria-label="upload picture" component="span">
                    <RefreshIcon />
                  </IconButton>}
                  <br />
                </Paper >

              </Paper>
              <Paper variant="outlined" sx={{ width: isMobile ? '100%' : '25%', marginLeft: '10px', p: 2, }} >
                <AssetViewComponent simulationId={this.props.simulation.id} />
              </Paper>

            </Stack>
            <DataView user={this.props.user} simulation={this.props.simulation} balanceData={this.state.balanceData} />


          </> : < >
            <></>
          </>
          }
        </Box >
      );
    } else {
      return (<div style={{ textAlign: 'center' }}><p>no data</p></div>);
    }

  }
}

export default DashboardView;
