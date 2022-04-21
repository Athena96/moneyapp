import * as React from 'react';

import { MonteCarloRowData
} from '../utilities/helpers';

import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import '../App.css';
import { Line } from "react-chartjs-2";
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { moneyGreenBoldText, black } from '../utilities/constants';
import { Tick } from 'chart.js';

interface GraphsViewProps {
}

interface IState {
  selectedTab: number;
  chartData: any | null;
  lastComputed: number | null;
  successPercent: string;
  simulationButtonLoading: boolean;
}

const STEPS = 500;

class GraphsView extends React.Component<GraphsViewProps, IState> {

  constructor(props: GraphsViewProps) {
    super(props);
    this.state = {
      selectedTab: 1,
      chartData: null,
      lastComputed: null,
      successPercent: "0.0",
      simulationButtonLoading: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const simulation = await SimulationDataAccess.fetchSelectedSimulation(this);
    const chartDataRaw = simulation.getSimulationData()!;
    const chartData = this.generateGraphData(chartDataRaw, 'brokerage');
    const successPercent = String(Number(simulation.successPercent).toFixed(0));
    const now = new Date();
    const hours = Math.abs(now.getTime() - simulation.lastComputed.getTime()) / 3600000;
    this.setState({ chartData: chartData, successPercent: successPercent, lastComputed: hours});
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  generateGraphData(simulationData: MonteCarloRowData[], account: string) {
    var chartData: any = {
      labels: [],
      datasets: []
    }

    const blue = 'rgba(37,113,207,1)';
    const yellow = 'rgba(255,204,0,1)';
    const moneyGreen = 'rgba(90,209,171,1)'
    const red = 'rgba(255,0,0,1)'

    const names = [
      {
        name: 'Best Scenario',
        color: blue,
        key: 'maxBalance'
      },
      {
        name: 'Average of all Scenarios',
        color: yellow,
        key: 'avgBalance'
      },
      {
        name: 'Linear Growth Assumption',
        color: moneyGreen,
        key: 'assumedAvgBalance'
      },
      {
        name: 'Worst Scenario',
        color: red,
        key: 'minBalance'
      }
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
          chartData.datasets[j].data.push(Number(dataRow.maxBalance.replace('$', '')))
        } else if (name.key === 'avgBalance') {
          chartData.datasets[j].data.push(Number(dataRow.avgBalance.replace('$', '')))
        } else if (name.key === 'assumedAvgBalance') {
          chartData.datasets[j].data.push(Number(dataRow.assumedAvgBalance.replace('$', '')))
        } else if (name.key === 'minBalance') {
          chartData.datasets[j].data.push(Number(dataRow.minBalance.replace('$', '')))
        }
      });
      j += 1;

    }
    return chartData;
  }

  render() {
    const options = {
      scales: {
        y: {
          min: -20000000,
          max: 20000000,
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

        },
        title: {
          display: true,
          text: 'Monte Carlo Simulations',
        },
      }
    };
    return (
      <Container >
        {this.state.chartData && this.state.lastComputed ? <>
          <Stack direction='column' >
            <Paper component="span" sx={{ maxWidth: '95%', marginTop: 2, p: 2 }}>
              <h3 style={{ color: black, width: 'min-width' }}>Chance of Success <Tooltip title={`Calculated using Monte Carlo, running ${STEPS} different simulations. This is the probability that you won't run out of money before you die.`}><InfoIcon /></Tooltip></h3>
              <h2 style={{ color: moneyGreenBoldText }}>{this.state.successPercent}%</h2>
              <Paper elevation={0} >
                <Line data={this.state.chartData} options={options} />
              </Paper >
              <small>Last simulation generated <b>{this.state.lastComputed < 1 ? (this.state.lastComputed*60).toFixed(0) : this.state.lastComputed.toFixed(0)} {this.state.lastComputed < 1 ? `minutes` : `hours`} ago</b></small>
            </Paper>
            <br />
            <br />
          </Stack>
        </> : < >
          <CircularProgress  />
        </>
        }
      </Container >
    );
  }
}

export default GraphsView;
