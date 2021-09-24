import * as React from 'react';

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import { getEvents, getBudgets, getAccounts } from '../utilities/dataSetup';
import { generateTable } from '../utilities/helpers';

import Box from '@mui/material/Box';

import '../App.css';

import { Line } from "react-chartjs-2";

interface GraphsViewProps {
}

interface IState {
  selectedTab: number;
  today: Date;
  events: Event[];
  budgets: Budget[];
  growth: number;
  inflation: number;
  absoluteMonthlyGrowth: number;
  startDate: Date;
  endDate: Date;
  dateIm59: Date;
  retireDate: Date;
  accounts: Account[];
  balances: any;
}

class GraphsView extends React.Component<GraphsViewProps, IState> {

  constructor(props: GraphsViewProps) {

    super(props);
    let n = new Date();

    this.state = {
      selectedTab: 1,
      today: n,
      events: [], //getEvents(),
      budgets: getBudgets(),
      growth: 10.49,
      inflation: 2.75,
      absoluteMonthlyGrowth: ((10.49 - 2.75) / 100) / 12,
      startDate: n,
      endDate: new Date('12/31/2096'),
      dateIm59: new Date('4/25/2055'),
      retireDate: new Date('1/29/2024'),
      accounts: getAccounts(),
      balances: {
        brokerage: {
          [0]: 0,

        },
        tax: {
          [0]: 0,
        }
      }
    }
    this.fetchEventData = this.fetchEventData.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchStartingBalances()
    this.fetchEventData()
  }

  async fetchStartingBalances() {
    const finnhub = require('finnhub');

    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
    const finnhubClient = new finnhub.DefaultApi()

    const holdingsMap = [
      {
        ticket: "VOO",
        quantity: 212.261,
        account: "brokerage"
      },
      {
        ticket: "VTI",
        quantity: 373.287,
        account: "brokerage"
      },
      {
        ticket: "ABNB",
        quantity: 3,
        account: "brokerage"
      },
      {
        ticket: "AMC",
        quantity: 1,
        account: "brokerage"
      },
      {
        ticket: "AAL",
        quantity: 1,
        account: "brokerage"
      },
      {
        ticket: "DAL",
        quantity: 5,
        account: "brokerage"
      },
      {
        ticket: "PLTR",
        quantity: 1,
        account: "brokerage"
      },
      {
        ticket: "UBER",
        quantity: 1,
        account: "brokerage"
      },

      {
        ticket: null,
        quantity: 3.08,
        account: "brokerage"
      },
      {
        ticket: "VTI",
        quantity: 36.899,
        account: "brokerage"
      },
      {
        ticket: "DAL",
        quantity: 5,
        account: "brokerage"
      },


      {
        ticket: "VTI",
        quantity: 46.430,
        account: "brokerage"
      },
      {
        ticket: "DAL",
        quantity: 3,
        account: "brokerage"
      },



      {
        ticket: "AMZN",
        quantity: 1,
        account: "brokerage"
      },
      {
        ticket: null,// ticket: "FXAIX",
        quantity: 200.05,
        account: "brokerage"
      },
      {
        ticket: null,
        quantity: 75,
        account: "brokerage"
      },

      {
        ticket: "BTC",
        isCurrency: true,
        quantity: 0.01869915,
        account: "brokerage"
      },
      {
        ticket: "ETH",
        isCurrency: true,
        quantity: 0.69812985,
        account: "brokerage"
      },

      {
        ticket: null,
        quantity: 16362.42,
        account: "tax"
      },

    ]
    for (const entry of holdingsMap) {
      if (entry.ticket !== null) {
        if (entry.isCurrency) {
          finnhubClient.cryptoCandles(`BINANCE:${entry.ticket}USDT`, "D", Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60, Math.floor(Date.now() / 1000), (error: any, data: any, response: any) => {
            const value: number = data.c[1];
            console.log(`${entry.ticket} - ${value}`);

            const holdingValue = value * entry.quantity;
            const newBrokCurr = entry.account === 'brokerage' ? this.state.balances['brokerage'][0] + holdingValue : this.state.balances['brokerage'][0];
            const currTaxCurr = entry.account === 'tax' ? this.state.balances['tax'][0] + holdingValue : this.state.balances['tax'][0];
            this.setState({
              balances: {
                brokerage: {
                  [0]: newBrokCurr,

                },
                tax: {
                  [0]: currTaxCurr,
                }
              }
            })
          });
        } else {
          finnhubClient.quote(entry.ticket, (error: any, data: any, response: any) => {
            const value: number = data.c;
            console.log(`${entry.ticket} - ${value}`);

            const holdingValue = value * entry.quantity;
            const newBrok = entry.account === 'brokerage' ? this.state.balances['brokerage'][0] + holdingValue : this.state.balances['brokerage'][0];
            const currTax = entry.account === 'tax' ? this.state.balances['tax'][0] + holdingValue : this.state.balances['tax'][0];
            this.setState({
              balances: {
                brokerage: {
                  [0]: newBrok,

                },
                tax: {
                  [0]: currTax,
                }
              }
            })
          });
        }
      } else {

        const newBrokNonStock = entry.account === 'brokerage' ? this.state.balances['brokerage'][0] + entry.quantity : this.state.balances['brokerage'][0];
        const currTaxNonStock = entry.account === 'tax' ? this.state.balances['tax'][0] + entry.quantity : this.state.balances['tax'][0];

        console.log(`${entry.ticket} - ${newBrokNonStock}`);
        console.log(`${entry.ticket} - ${newBrokNonStock}`);


        this.setState({
          balances: {
            brokerage: {
              [0]: newBrokNonStock,

            },
            tax: {
              [0]: currTaxNonStock,
            }
          }
        })
      }

    }

  }

  async fetchEventData() {
    const finnhub = require('finnhub');

    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
    const finnhubClient = new finnhub.DefaultApi()


    finnhubClient.quote("AMZN", (error: any, data: any, response: any) => {
      const currentAmazonStockPrice: number = data.c;
      this.setState({ events: getEvents(currentAmazonStockPrice) })
    });

  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  // subscribe to updates to Account/Budget/Event... regenerate chart when they change.

  render() {
    const [balanceData, chartData] = generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth,
      this.state.accounts, this.state.startDate, this.state.endDate, this.state.dateIm59, this.state.retireDate);
    return (
      <div>
        <Box sx={{ width: '100%' }}>

          <Line data={chartData} />
        </Box>
      </div>

    );
  }
}

export default GraphsView;
