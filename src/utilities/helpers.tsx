

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';
import { CategoryTypes } from "../API";

export interface RowData {
  date: string;
  brokerageBal: string;
  taxBal: string;
  note:string;
  accountUsed:string;
}

export function dateRange(startDate: Date, endDate: Date, steps = 30) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

export function getCurrentBudget(date: Date, budgets: Budget[]) {
  for (const budget of budgets) {
    if (date >= budget.startDate && date <= budget.endDate) {
      return budget;
    }
  }
}

export function use(account: Account, currentDate: Date, currentDateIndex: number, dateIm59: Date, balances: any, retireDate: Date) {
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

export function generateTable(balances: any, events: Event[], budgets: Budget[], absoluteMonthlyGrowth: number, myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date, retireDate: Date) {
  var tmpChartData:any = {
    labels: [],
    datasets: [
      {
        label: "brokerage",
        data: [],
        borderColor: "rgba(75,192,192,1)"
      },
      {
        label: "tax",
        data: [],
        borderColor: "#742774"
      }
    ]
  };

  // create a list of dates incrementing by 1 month
  const dates = dateRange(startDate, endDate);
  let data = dates.map( (date, i) => {
    let eventDesc = "";
    let accntUsed = "";

    if (i > 0) {
      // for each account, compute their currentDay balance, then return the entry to put it in the table
      for (const account of myaccounts) {

        // USE or GROW the account?
        if (use(account, date, i, dateIm59, balances, retireDate)) {
          accntUsed = account.name;
          const budget = getCurrentBudget(date, budgets)!;
          const afterSpending = balances[account.name][i-1] - budget.getTypeSum(CategoryTypes.Expense);
          balances[account.name][i] = afterSpending + absoluteMonthlyGrowth * afterSpending + budget.getTypeSum(CategoryTypes.Income)
        } else {
          balances[account.name][i] = balances[account.name][i-1] + absoluteMonthlyGrowth * balances[account.name][i-1];
          if (balances[account.name][i-1] <= 0.0) {
            balances[account.name][i] = 0.0;
          }
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

    const r: RowData = {
      date: `${date.getMonth()+1}/${date.getFullYear()}`,
      brokerageBal: `${balances['brokerage'][i].toFixed(2)}`,
      taxBal: `${balances['tax'][i].toFixed(2)}`,
      note: eventDesc,
      accountUsed: accntUsed
    };

    return r;

  });

  return [data,tmpChartData];
}