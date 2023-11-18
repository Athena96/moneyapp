import * as React from "react";

import RefreshIcon from "@mui/icons-material/Refresh";

import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import "../../App.css";
import { Line } from "react-chartjs-2";
import { moneyGreenBoldText, black } from "../../utilities/constants";
import { Tick } from "chart.js";
import { Recurring } from "../../model/Base/Recurring";

import Box from "@mui/material/Box";

import { MonteCarloData } from "montecarlo-lib";
import CircularProgress from "@mui/material/CircularProgress";

import { DataView } from "./DataView";
import { ScenarioData } from "../../model/Base/ScenarioData";
import { ScenarioDataService } from "../../services/scenario_data_service";
import { Asset } from "../../model/Base/Asset";
import { calculateAge, getMonteCarloProjection } from "../../utilities/helpers";


interface DashboardViewProps {
  user: string;
  scenarioId: string;
}

interface IState {
  selectedTab: number;
  chartData: any | null;
  successPercent: string;
  startingBalance: number;
  simulationButtonLoading: boolean;
  balanceData: number[];
  startingAge: number;

  scenarioData: ScenarioData | undefined;
}


class DashboardView extends React.Component<DashboardViewProps, IState> {
  constructor(props: DashboardViewProps) {
    super(props);
    this.state = {
      selectedTab: 1,
      chartData: null,
      successPercent: "0.0",
      startingBalance: 0.0,
      simulationButtonLoading: false,
      balanceData: [],
      startingAge: 0,
      scenarioData: undefined,

    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTriggerSimulation = this.handleTriggerSimulation.bind(this);
  }

  async componentDidMount() {
    const scenarioData = await ScenarioDataService.getScenarioData(this.props.scenarioId);
    this.setState({ scenarioData, startingAge: calculateAge(scenarioData.settings.birthday.toISOString()) });
    await this.handleTriggerSimulation(scenarioData);
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  async handleTriggerSimulation(scenarioData: ScenarioData) {
    const assets = scenarioData.assets;
    const myrecurrings = scenarioData.recurrings;
    const settings = scenarioData.settings;
    const startingBalance = Asset.computeTotalAssetValue(assets);
    const monteCarloData = await getMonteCarloProjection(
      this.props.scenarioId,
      startingBalance,
      myrecurrings,
      settings
    );
    const successPercentString = `${monteCarloData.successPercent.toFixed(2)}`;
    const chartData = this.generateGraphData(monteCarloData);
    this.setState({
      chartData,
      successPercent: successPercentString,
      startingBalance: startingBalance,
      balanceData: monteCarloData.medianLine,
    });
  }

  generateGraphData(monteCarloData: MonteCarloData) {
    var chartData: any = {
      labels: [],
      datasets: [],
    };

    const moneyGreen = "rgba(90,209,171,1)";
    const names = [
      // {
      //   name: 'Best Scenario',
      //   color: blue,
      //   key: 'maxBalance'
      // },
      {
        name: "Average of all Scenarios",
        color: moneyGreen,
        key: "assumedAvgBalanceBrok",
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
    ];

    // add date labels
    monteCarloData.medianLine.forEach((dataRow, i) => {
      chartData.labels.push(`${i + this.state.startingAge}`);
    });

    let j = 0;
    for (const name of names) {
      chartData.datasets.push({
        label: name.name,
        data: [],
        borderColor: name.color,
        pointBorderWidth: 1,
        pointRadius: 1,
      });
      // eslint-disable-next-line no-loop-func

      monteCarloData.medianLine.forEach((dataRow, i) => {
        if (name.key === "maxBalance") {
          // chartData.datasets[j].data.push(Number(dataRow.maxBalance.replace('$', '')))
        } else if (name.key === "avgBalance") {
          // chartData.datasets[j].data.push(Number(dataRow.avgBalance.replace('$', '')))
        } else if (name.key === "minBalance") {
          // chartData.datasets[j].data.push(Number(dataRow.minBalance.replace('$', '')))
        } else if (name.key === "assumedAvgBalanceBrok") {
          chartData.datasets[j].data.push(dataRow);
        }
      });
      j += 1;
    }
    return chartData;
  }

  render() {
    const isMobile = window.innerWidth <= 399;
    const options = {
      scales: {
        y: {
          min: 0,

          ticks: {
            callback: function (tickValue: string | number, index: number, ticks: Tick[]) {
              if ((tickValue as number) >= 1000000) {
                return "$" + (tickValue as number) / 1000000 + " M";
              } else if ((tickValue as number) <= -1000000) {
                return "$" + (tickValue as number) / 1000000 + " M";
              } else {
                return "$" + (tickValue as number);
              }
            },
          },
        },
        x: {
          display: false,
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
          display: isMobile ? false : true,
        },
        title: {
          display: true,
          text: "Monte Carlo Simulations",
        },
      },
    };

    // add more quote data: https://finnhub.io/docs/api/quote

    if (this.state.scenarioData && this.state.chartData) {
      return (
        <Box>

          <>
            <h1>Dashboard</h1>

            <Stack direction={isMobile ? "column" : "row"} spacing={2}>
              <Paper variant="outlined" sx={{ width: isMobile ? "100%" : "75%", p: 2 }}>
                <h3 style={{ color: black, width: "min-width" }}>
                  Chance of Success{" "}
                  <Tooltip
                    title={`Calculated using Monte Carlo, running 1,000 different simulations. This is the probability that you won't run out of money before you die.`}
                  >
                    <InfoIcon />
                  </Tooltip>
                </h3>
                <h2 style={{ color: moneyGreenBoldText }}>{this.state.successPercent}%</h2>
                <small style={{ color: "black" }}>
                  <b>Starting Balance</b>: ${this.state.startingBalance.toLocaleString()}
                </small>
                <Paper>
                  {/* https://apexcharts.com/react-chart-demos/line-charts/zoomable-timeseries/ */}
                  <Line data={this.state.chartData} options={options} />
                  {this.state.simulationButtonLoading ? (
                    <Box>
                      <small>Running 1,000 different Monte Carlo Simulations, this may take a moment... </small>
                    </Box>
                  ) : (
                    <IconButton
                      onClick={() => this.handleTriggerSimulation(this.state.scenarioData as ScenarioData)}
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <RefreshIcon />
                    </IconButton>
                  )}
                  <br />
                </Paper>
              </Paper>
            </Stack>

            <DataView
            // user={this.props.user}
            // simulation={this.props.simulation}
            // balanceData={this.state.balanceData}
            // recurrings={this.state.recurrings}
            // onetimes={this.state.onetimes}
            />
          </>

        </Box>
      );
    } else {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        </div>
      );
    }
  }
}

export default DashboardView;