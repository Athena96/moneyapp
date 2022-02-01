import { Event } from '../model/Base/Event';
import { Budget } from '../model/Base/Budget';
import { Account } from '../model/Base/Account';
import { CategoryTypes } from "../API";
import { Key } from '../model/Interfaces/KeyInterface';

export interface RowData {
  date: string;
  brokerageBal: string;
  taxBal: string;
  note: string;
  accountUsed: string;
}

// actual general helpers

export function dateRange(startDate: Date, endDate: Date, steps = 31) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    var month = currentDate.getMonth() + 1; // increment the month
    var year = month === 0 ? currentDate.getFullYear() + 1 : currentDate.getFullYear(); // if it incremented to January, then increment the year.
    currentDate = new Date(year, month, 1);
  }
  
  return dateArray;
}

export function getCurrentBudget(date: Date, budgets: Budget[]) {
  date.setHours(0, 0, 0);
  for (const budget of budgets) {
    if (date >= new Date(budget.startDate.setHours(0, 0, 0)) && date <= new Date(budget.endDate.setHours(0, 0, 0))) {
      return budget;
    }
  }
}

export function use(account: Account, currentDate: Date, currentDateIndex: number, dateIm59: Date, balances: any, retireDate: Date) {
  // don't USE any of my accounts before my retire date, only GROW them
  // if (currentDate < retireDate) {
  //   return false;
  // }

  // use brokerage before im 59, then use up my 401k, then go back to my brokerage
  let accntToUse = null;
  if (currentDate < dateIm59) {
    accntToUse = 'brokerage';
  } else if (currentDate >= dateIm59 && balances['tax'][currentDateIndex - 1] > 0) {
    accntToUse = 'tax';
  } else if (currentDate >= dateIm59 && balances['tax'][currentDateIndex - 1] <= 0) {
    accntToUse = 'brokerage';
  }

  return account.name === accntToUse;
}

export function generateData(balances: any, events: Event[], budgets: Budget[], absoluteMonthlyGrowth: number,
  myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date, retireDate: Date, minEnd: number) {

  // create a list of dates incrementing by 1 month
  const dates = dateRange(startDate, endDate);
  let data = dates.map((date, i) => {
    let eventDesc = "";
    let accntUsed = "";

    // for each account, compute their currentDay balance, then return the entry to put it in the table
    for (const account of myaccounts) {
      let dateToSlowGroth = new Date(2061,5,15); // todo get this from Inputs when I'm 65
      let growth = (date > dateToSlowGroth && account.name !== 'tax') ? ((7.2-2.75)/12/100) : absoluteMonthlyGrowth; // todo, get growth and inflation from Inputs

      if (i > 0) {
        // USE or GROW the account?
        if (use(account, date, i, dateIm59, balances, retireDate)) {
          accntUsed = account.name;
          const budget = getCurrentBudget(date, budgets)!;
          const afterSpending = balances[account.name][i - 1] - budget.getTypeSum(CategoryTypes.Expense);
          balances[account.name][i] = afterSpending + growth * afterSpending + budget.getTypeSum(CategoryTypes.Income)
        } else {
          balances[account.name][i] = balances[account.name][i - 1] + growth * balances[account.name][i - 1];
          if (balances[account.name][i - 1] <= 0.0) {
            balances[account.name][i] = 0.0;
          }
        }
      }

      // Apply Events regardless if im using the account or not
      for (const event of events) {
        // if the event is to be debited from the account, and it occurs this month/year then account for it
        if (event.account === account.name) {
          if (event.date.getMonth() === date.getMonth() && event.date.getFullYear() === date.getFullYear()) {
            eventDesc += event.name;

            if (event.category) {
              switch (event.category.type) {
                case CategoryTypes.Expense:
                  eventDesc += ` -$${event.category.getValue()}`;
                  balances[account.name][i] -= event.category!.getValue();
                  break;
                case CategoryTypes.Income:
                  eventDesc += ` +$${event.category.getValue()}`;
                  balances[account.name][i] += event.category!.getValue();
                  break;
                default:
                  eventDesc += ` ERROR`;
                  balances[account.name][i] -= event.category!.getValue();
                  break;
              }
            }

            eventDesc += ' | ';
          }
        }
      }
      // }
    }

    const r: RowData = {
      date: `${date.getMonth() + 1}/${date.getFullYear()}`,
      brokerageBal: `$${balances['brokerage'][i].toFixed(2)}`,
      taxBal: `$${balances['tax'][i].toFixed(2)}`,
      note: eventDesc,
      accountUsed: accntUsed
    };

    return r;

  });

  return data;
}

export function generateGraphData(balances: any, events: Event[], budgets: Budget[], absoluteMonthlyGrowth: number,
  myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date, retireDate: Date, minEnd: number) {
  var tmpChartData: any = {
    labels: [],
    datasets: [
      {
        label: "brokerage",
        data: [],
        borderColor: "rgba(37,113,207,1)",
        pointBorderWidth: 1,
        pointRadius: 1,

      },
      {
        label: "tax",
        data: [],
        borderColor: "rgba(0,125,76,1)",
        pointBorderWidth: 1,
        pointRadius: 1,

      },
      {
        label: "",
        data: [],
        borderColor: "rgba(0,0,0,1)",
        pointBorderWidth: 1,
        pointRadius: 1,
      }
    ]
  };
  let data = generateData(balances, events, budgets, absoluteMonthlyGrowth!, myaccounts, startDate!, endDate!, dateIm59!, retireDate!, minEnd!)
  data.forEach((dataRow, i) => {
    tmpChartData.labels.push(`${dataRow.date}`);
    tmpChartData.datasets[0].data.push(Number(dataRow.brokerageBal.replace('$', '')));
    tmpChartData.datasets[1].data.push(Number(dataRow.taxBal.replace('$', '')));
    tmpChartData.datasets[2].data.push(minEnd);
  });
  return tmpChartData;
}

export function cleanNumberDataInput(input: string) {
  return input.replace(/[^\d.-]/g, '');
}

export function getObjectWithId(idToFind: string, keyObjects: Key[]) {
  for (const obj of keyObjects) {
    if (obj.getKey() === idToFind) {
      return obj;
    }
  }
}
