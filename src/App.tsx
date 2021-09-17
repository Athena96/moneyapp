import React, { Component } from 'react';
import './App.css';
import { Event } from './model/Event';
import { Budget } from './model/Budget';
import { Account } from './model/Account';

import { getEvents, getBudgets } from './utilities/dataSetup';
import { dateRange } from './utilities/helpers';

interface IProps {
}

interface IState {
  today: Date;
  events: Event[];
  budgets: Budget[];
  growth: number;
  inflation: number;
  absoluteGrowth: number;
  startDate: Date;
  endDate: Date;
  dateIm59 : Date;
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

    const y = new Date();
    y.setDate(n.getDate()-1);


    this.state = {
      today: n ,
      events: getEvents(),
      budgets: getBudgets(),
      growth: 10.49,
      inflation: 2.75,
      absoluteGrowth: (10.49-2.75) / 100,
      startDate: n,
      endDate: new Date('10/10/2021'),
      dateIm59:  new Date('4/25/2055'),
      accounts: theaccounts,
      balances: {
        brokerage: {
          [y.toString()]: 100,
          [n.toString()]: 110
        },
        tax: {
          [y.toString()]: 50,
          [n.toString()]: 110
        }
      }
    }
    this.render = this.render.bind(this);

  }

  getCurrentBudget(date: Date, budgets: Budget[]) {
    for (const budget of budgets) {
      if (date >= budget.startDate && date <= budget.endDate) {
        return budget;
      }
    }
  }

  render() {

    return (
      <div >
        
        <table>
          <tbody>

            <tr>
              <th>Date</th>
              <th>Brokerage</th>
              <th>Tax</th>
              <th>Note</th>

            </tr>
            {this.generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteGrowth, this.state.accounts, this.state.startDate, this.state.endDate, this.state.dateIm59)}
          </tbody>

        </table>

      </div>
    );
  }

  use(account: Account) {
    return true;
  }

  generateTable(balances: any, events: Event[], budgets: Budget[], absoluteGrowth: number, myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date) {
    
    const dates = dateRange(startDate, endDate);

    // for each date
    return dates.map( (date, i) => {

      // for each account
      for (const account of myaccounts) {
        const yesterday = new Date(date.getTime());
        yesterday.setDate(date.getDate() - 1);
 
        // IF use some Rule to determine if im using this Account now or now.
          // USE
        // else Not using the account now.
          // GROW
        if (this.use(account)) {
          const budget = this.getCurrentBudget(date, budgets)!;
          
          const afterSpending = balances[account.name][yesterday.toString()] - budget.getTypeSum(0)
          balances[account.name][date.toString()] = afterSpending + absoluteGrowth * afterSpending + budget.getTypeSum(0)
        } else {
          balances[account.name][date.toString()] = balances[account.name][yesterday.toString()]  + absoluteGrowth * balances[account.name][yesterday.toString()];
        }

        // Apply Events regardless if im using the account or not
        for (const event of events) {
          if (event.category.type === 0) {
            balances[account.name][date.toString()] -=  event.category.getValue();
          }

          if (event.category.type === 1) {
            balances[account.name][date.toString()] +=  event.category.getValue();
          }
        }

      }

      let b: number = balances['brokerage'][date.toString()];
      let t: number = balances['tax'][date.toString()];
      return (

        <tr>
          <td>{date.toString().split("GMT")[0]}</td>
          <td>{b.toFixed(2)}</td>
          <td>{t.toFixed(2)}</td>

          <td>....</td>
        </tr>
      );
    });
  }
}

export default App;
