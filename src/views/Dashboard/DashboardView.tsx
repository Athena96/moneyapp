import * as React from 'react';

import {
  MonteCarloRowData
} from '../../utilities/helpers';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from "react-router-dom";

import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import IconButton from '@mui/material/IconButton';
import { API, Auth } from 'aws-amplify';
import Amplify from 'aws-amplify';
import Paper from '@mui/material/Paper';
import '../../App.css';
import { Line } from "react-chartjs-2";
import { moneyGreenBoldText, black } from '../../utilities/constants';
import { Tick } from 'chart.js';
import { Simulation } from '../../model/Base/Simulation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SimulationStatus } from '../../API';
import { SimulationDataAccess } from '../../utilities/SimulationDataAccess';

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
}

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'apiCall',
        endpoint: 'https://40glxro469.execute-api.us-west-2.amazonaws.com/prod',
        region: 'us-west-2',
        custom_header: async () => {
          return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
        }
      }
    ]
  }
});

class DashboardView extends React.Component<DashboardViewProps, IState> {

  constructor(props: DashboardViewProps) {
    super(props);
    this.state = {
      chartDataRaw: undefined,
      selectedTab: 1,
      chartData: null,
      lastComputed: null,
      successPercent: "0.0",
      simulationButtonLoading: ((this.props.simulation?.status || SimulationStatus.Done) === SimulationStatus.Done) ? false : true,
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.handleTriggerSimulation = this.handleTriggerSimulation.bind(this);


  }

  componentDidMount() {
    this.getData();
    const self = this;
    setInterval(async function () {
      const simulation = await SimulationDataAccess.fetchSelectedSimulationForUser(null, self.props.user);
      if (simulation) {
        const chartDataRaw = simulation.getSimulationData()!;
        const chartData = self.generateGraphData(chartDataRaw, 'brokerage');
        const successPercent = String(Number(simulation.successPercent).toFixed(0));
        const status = simulation.status === SimulationStatus.Done ? false : true;
        const now = new Date();
        const hours = Math.abs(now.getTime() - simulation.lastComputed.getTime()) / 3600000;
        self.setState({ chartData: chartData, successPercent: successPercent, simulationButtonLoading: status, lastComputed: hours, chartDataRaw: chartDataRaw })
      }
    }, 6000);
  }

  async getData() {
    if (this.props.simulation) {
      const chartDataRaw = this.props.simulation.getSimulationData()!;
      const chartData = this.generateGraphData(chartDataRaw, 'brokerage');
      const successPercent = String(Number(this.props.simulation.successPercent).toFixed(0));
      const now = new Date();
      const hours = Math.abs(now.getTime() - this.props.simulation.lastComputed.getTime()) / 3600000;
      this.setState({ chartData: chartData, successPercent: successPercent, lastComputed: hours, chartDataRaw: chartDataRaw });
    }
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  async handleTriggerSimulation() {
    try {
      this.setState({ simulationButtonLoading: true });

      const user = await Auth.currentAuthenticatedUser();
      const email: string = user.attributes.email;


      API.post('apiCall', '/router', {
        queryStringParameters: {
          email,
          command: "RunSimulation"
        },
      });

    } catch (e) {
      console.log(e)
    }
  }

  generateGraphData(simulationData: MonteCarloRowData[], account: string) {
    var chartData: any = {
      labels: [],
      datasets: []
    }

    const blue = 'rgba(37,113,207,1)';
    const moneyGreen = 'rgba(90,209,171,1)'
    // const red = 'rgba(255,0,0,1)'

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
      {
        name: 'Average of all Scenarios Tax',
        color: blue,
        key: 'assumedAvgBalanceTax'
      }
      // {
      //   name: 'Worst Scenario',
      //   color: red,
      //   key: 'minBalance'
      // }
    ]

    // add date labels
    simulationData.forEach((dataRow, i) => {
      chartData.labels.push(`${dataRow.date}`);
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
      simulationData.forEach((dataRow, i) => {
        if (name.key === 'maxBalance') {
          // chartData.datasets[j].data.push(Number(dataRow.maxBalance.replace('$', '')))
        } else if (name.key === 'avgBalance') {
          // chartData.datasets[j].data.push(Number(dataRow.avgBalance.replace('$', '')))
        } else if (name.key === 'minBalance') {
          // chartData.datasets[j].data.push(Number(dataRow.minBalance.replace('$', '')))
        } else if (name.key === 'assumedAvgBalanceBrok') {
          chartData.datasets[j].data.push(Number(dataRow.assumedAvgBalanceBrok.replace('$', '')))
        } else if (name.key === 'assumedAvgBalanceTax') {
          chartData.datasets[j].data.push(Number(dataRow.assumedAvgBalanceTax.replace('$', '')))
        } else if (name.key === 'incomeExpenses') {
          chartData.datasets[j].data.push(Number(dataRow.incomeExpenses?.replace('$', '')))
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
    const isMobile = window.innerWidth <= 390;
    const max = this.getMax();
    const options = {
      scales: {
        y: {
          min: 0,
          max: this.state.chartDataRaw ? max : 1000000,
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

    if (this.props.simulation) {
      return (
        <Box >
          {this.state.chartData && this.state.lastComputed ? <>
            <h1 >Dashboard</h1>

            <Paper variant="outlined" sx={{ p: 2, }} >
              <h3 style={{ color: black, width: 'min-width' }}>Chance of Success <Tooltip title={`Calculated using Monte Carlo, running 1,000 different simulations. This is the probability that you won't run out of money before you die.`}><InfoIcon /></Tooltip></h3>
              <h2 style={{ color: moneyGreenBoldText }}>{this.state.successPercent}%</h2>
              <Paper  >
                {/* https://apexcharts.com/react-chart-demos/line-charts/zoomable-timeseries/ */}
                <Line data={this.state.chartData} options={options} />
                <small style={{ marginLeft: '10px' }}>Last simulation generated <b>{this.state.lastComputed < 1 ? (this.state.lastComputed * 60).toFixed(0) : this.state.lastComputed.toFixed(0)} {this.state.lastComputed < 1 ? `minute(s)` : `hour(s)`} ago</b></small>


                {this.state.simulationButtonLoading ? <Box ><CircularProgress /><small >Running 1,000 different Monte Carlo Simulations, this may take a moment... </small></Box>: <IconButton onClick={this.handleTriggerSimulation} color="primary" aria-label="upload picture" component="span">
                  <RefreshIcon />
                </IconButton>}


                <br />
                <small style={{ marginLeft: '10px' }}><u><Link style={{ color: 'black', textDecoration: 'none' }} to={`/data`}>see data</Link></u></small><br />

              </Paper >

            </Paper>

          </> : < >
            <CircularProgress />
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
