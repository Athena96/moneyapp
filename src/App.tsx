import React from 'react';
import './App.css';
import { Event } from './model/Event';
import { Budget } from './model/Budget';
import { Account } from './model/Account';
import { CategoryTypes } from './model/Category';

import { getEvents, getBudgets } from './utilities/dataSetup';
import { dateRange } from './utilities/helpers';
import { Line } from "react-chartjs-2";

interface IProps {
}

interface IState {
  doneComputing: boolean,
  chartData: any,
  today: Date;
  events: Event[];
  budgets: Budget[];
  growth: number;
  inflation: number;
  absoluteMonthlyGrowth: number;
  startDate: Date;
  endDate: Date;
  dateIm59 : Date;
  retireDate : Date;
  accounts: Account[];
  balances: any;
}

class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
  
    super(props);
    let n = new Date();
    let brokerage = new Account('brokerage');
    let tax = new Account('tax');
    let theaccounts: Account[] = [];
    theaccounts.push(brokerage);
    theaccounts.push(tax);

    this.state = {
      doneComputing: false,
      chartData: {
        labels: [],
        datasets: [
          {
            label: "brokerage",
            data: [],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          },
          {
            label: "tax",
            data: [],
            fill: false,
            borderColor: "#742774"
          }
        ]
      },
      today: n,
      events: getEvents(),
      budgets: getBudgets(),
      growth: 10.49,
      inflation: 2.75,
      absoluteMonthlyGrowth: ((10.49-2.75) / 100)/12,
      startDate: n,
      endDate: new Date('12/31/2024'),
      dateIm59:  new Date('4/25/2055'),
      retireDate: new Date('1/29/2024'),
      accounts: theaccounts,
      balances: {
        brokerage: {
          [0]: 200131.22,
          
        },
        tax: {
          [0]: 16362.42,
        }
      }
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.generateTable = this.generateTable.bind(this);

    this.render = this.render.bind(this);
  }

  componentDidMount() {

  }

  render() {
    const [balanceData,chartData] = this.generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth, 
      this.state.accounts, this.state.startDate, this.state.endDate, this.state.dateIm59, this.state.retireDate);
    return (
      <div >
        <div>
        <Line data={chartData} />

          </div>
        <div>
          <table>
            <tbody>

              <tr>
                <th>Date</th>
                <th>Brokerage</th>
                <th>Tax</th>
                <th>Note</th>

              </tr>
              {balanceData}
            </tbody>

          </table>
        </div>
      </div>
    );
  }

  getCurrentBudget(date: Date, budgets: Budget[]) {
    for (const budget of budgets) {
      if (date >= budget.startDate && date <= budget.endDate) {
        return budget;
      }
    }
  }
  
  use(account: Account, currentDate: Date, currentDateIndex: number, dateIm59: Date, balances: any, retireDate: Date) {
    // don't USE any of my accounts before my retire date, only GROW them
    if (currentDate < retireDate) {
      return false;
    }

    // use brokerage before im 59, then use up my 401k, then go back to my brokerage
    let accntToUse = null;
    if (currentDate < dateIm59) {
      accntToUse = 'brokerage';
    } else if (currentDate >= dateIm59 && balances['tax'][currentDateIndex-1] > 0) {
      accntToUse = 'tax';
    } else if (currentDate >= dateIm59 && balances['tax'][currentDateIndex-1] <= 0) {
      accntToUse = 'brokerage';
    }

    return account.name === accntToUse;
  }

  generateTable(balances: any, events: Event[], budgets: Budget[], absoluteMonthlyGrowth: number, myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date, retireDate: Date) {
    console.log("generateTable");
    var tmpChartData:any = {
      labels: [],
      datasets: [
        {
          label: "brokerage",
          data: [],
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)"
        },
        {
          label: "tax",
          data: [],
          fill: false,
          borderColor: "#742774"
        }
      ]
    };


    // create a list of dates incrementing by 1 month
    const dates = dateRange(startDate, endDate);
    let data = dates.map( (date, i) => {
      let eventDesc = "";

      if (i > 0) {
        // for each account, compute their currentDay balance, then return the entry to put it in the table
        for (const account of myaccounts) {

          // USE or GROW the account?
          if (this.use(account, date, i, dateIm59, balances, retireDate)) {
            const budget = this.getCurrentBudget(date, budgets)!;
            const afterSpending = balances[account.name][i-1] - budget.getTypeSum(CategoryTypes.Expense);
            balances[account.name][i] = afterSpending + absoluteMonthlyGrowth * afterSpending + budget.getTypeSum(CategoryTypes.Income)
          } else {
            balances[account.name][i] = balances[account.name][i-1] + absoluteMonthlyGrowth * balances[account.name][i-1];
          }

          // Apply Events regardless if im using the account or not
          for (const event of events) {
            // if the event is to be debited from the account, and it occurs this month/year then account for it
            if (event.account === account.name) {
              if (event.date.getMonth() === date.getMonth() && event.date.getFullYear() === date.getFullYear()) {
                eventDesc += event.name;
                if (event.category) {
                  if (event.category!.type === CategoryTypes.Expense) {
                    balances[account.name][i] -= event.category!.getValue();
                  }      
                  if (event.category!.type === CategoryTypes.Income) {
                    balances[account.name][i] += event.category!.getValue();
                  }
                }
                if (event.name !== "") eventDesc += ' -- ';
              }
            }
          }
        }
      }

      tmpChartData.labels.push(`${date.getMonth()+1}/${date.getFullYear()}`);
      tmpChartData.datasets[0].data.push(balances['brokerage'][i].toFixed(2));
      tmpChartData.datasets[1].data.push(balances['tax'][i].toFixed(2));

      return (
        <tr>
          <td>{`${date.getMonth()+1}/${date.getFullYear()}`}</td>
          <td>${balances['brokerage'][i].toFixed(2)}</td>
          <td>${balances['tax'][i].toFixed(2)}</td>
          <td>{eventDesc}</td>
        </tr>
      );
    });

    return [data,tmpChartData];
  }
}

export default App;
