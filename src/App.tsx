import React, { Component } from 'react';
import './App.css';
import { Event } from './model/Event';
import { Budget } from './model/Budget';

import { getEvents, getBudgets } from './utilities/dataSetup';
import { dateRange } from './utilities/helpers';

class App extends Component {


  getCurrentBudget(date: Date, budgets: [Budget]) {
    for (const budget of budgets) {
      if (date >= budget.startDate && date <= budget.endDate) {
        return budget;
      }
    }
  }

  render() {

    // inputs
    let events = getEvents();
    let budgets = getBudgets();

    const growth = 10.490;
    const inflation = 2.75;
    const absoluteGrowth = (growth - inflation) / 100;

    const brokerageStartingBalance = 120000;
    const taxAccountStartingBalance = 13000;
    let brokerageBalance = [brokerageStartingBalance];
    let taxAccountBalance = [taxAccountStartingBalance];

    const startDate = new Date();
    const endDate = new Date('10/10/2021');
    const dateIm59 = new Date('4/25/55');

    return (
      <div >
        <table>
          <tbody>

            <tr>
              <th>Date</th>
              <th>Contact</th>
              <th>Country</th>
            </tr>
            {this.generateTable(events, budgets, absoluteGrowth, [brokerageBalance, taxAccountBalance], startDate, endDate, dateIm59)}
          </tbody>

        </table>

      </div>
    );
  }


  generateTable(events: Event[], budgets: Budget[], absoluteGrowth: number, accounts: any[], startDate: Date, endDate: Date, dateIm59: Date) {
    const dates = dateRange(startDate, endDate);

    // for each date
    return dates.map((date, i) => {
      

      // for each account

        // IF use some Rule to determine if im using this Account now or now.
          // USE
        // else Not using the account now.
          // GROW


        // Apply Events regardless if im using the account or not

      return (
        <tr>
          <td>{date.toString().split("GMT")[0]}</td>
          <td>{1.0}</td>
          <td>Mexico</td>
        </tr>
      );
    });
  }
}

export default App;
