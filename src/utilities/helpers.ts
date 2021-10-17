import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';
import { Asset } from '../model/Asset';
import { CategoryTypes } from "../API";

import { getCookie, setCookie } from './CookiesHelper';
import { AssetDataAccess } from './AssetDataAccess';

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
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
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

    if (i > 0) {
      // for each account, compute their currentDay balance, then return the entry to put it in the table
      for (const account of myaccounts) {

        // USE or GROW the account?
        if (use(account, date, i, dateIm59, balances, retireDate)) {
          accntUsed = account.name;
          const budget = getCurrentBudget(date, budgets)!;
          const afterSpending = balances[account.name][i - 1] - budget.getTypeSum(CategoryTypes.Expense);
          balances[account.name][i] = afterSpending + absoluteMonthlyGrowth * afterSpending + budget.getTypeSum(CategoryTypes.Income)
        } else {
          balances[account.name][i] = balances[account.name][i - 1] + absoluteMonthlyGrowth * balances[account.name][i - 1];
          if (balances[account.name][i - 1] <= 0.0) {
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

  // create a list of dates incrementing by 1 month
  const dates = dateRange(startDate, endDate);
  dates.forEach((date, i) => {

    if (i > 0) {
      // for each account, compute their currentDay balance, then return the entry to put it in the table
      for (const account of myaccounts) {

        // USE or GROW the account?
        if (use(account, date, i, dateIm59, balances, retireDate)) {
          const budget = getCurrentBudget(date, budgets)!;
          const afterSpending = balances[account.name][i - 1] - budget.getTypeSum(CategoryTypes.Expense);
          balances[account.name][i] = afterSpending + absoluteMonthlyGrowth * afterSpending + budget.getTypeSum(CategoryTypes.Income)
        } else {
          balances[account.name][i] = balances[account.name][i - 1] + absoluteMonthlyGrowth * balances[account.name][i - 1];
          if (balances[account.name][i - 1] <= 0.0) {
            balances[account.name][i] = 0.0;
          }
        }

        // Apply Events regardless if im using the account or not
        for (const event of events) {
          // if the event is to be debited from the account, and it occurs this month/year then account for it
          if (event.account === account.name) {
            if (event.date.getMonth() === date.getMonth() && event.date.getFullYear() === date.getFullYear()) {
              if (event.category) {
                if (event.category!.type === CategoryTypes.Expense) {
                  balances[account.name][i] -= event.category!.getValue();
                }
                if (event.category!.type === CategoryTypes.Income) {
                  balances[account.name][i] += event.category!.getValue();
                }
              }
            }
          }
        }
      }
    }

    tmpChartData.labels.push(`${date.getMonth() + 1}/${date.getFullYear()}`);
    tmpChartData.datasets[0].data.push(balances['brokerage'][i].toFixed(2));
    tmpChartData.datasets[1].data.push(balances['tax'][i].toFixed(2));
    tmpChartData.datasets[2].data.push(minEnd);
  });

  return tmpChartData;
}

// data manipulation
export async function fetchStartingBalances(componentState: any) {
  const finnhub = require('finnhub');

  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  delete finnhub.ApiClient.instance.defaultHeaders['User-Agent'];

  api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
  const finnhubClient = new finnhub.DefaultApi()

  const assets: Asset[] = await AssetDataAccess.fetchAssets(null);

  if (!componentState.state.balances['brokerage']) {
    componentState.state.balances['brokerage'] = {
      0: 0.0
    }
  }

  if (!componentState.state.balances['tax']) {
    componentState.state.balances['tax'] = {
      0: 0.0
    }
  }

  for (const entry of assets) {
    if (entry.ticker !== null && entry.hasIndexData === 1) {
      if (entry.isCurrency === 1) {

        const cookie = getCookie(entry.ticker);
        if (cookie) {
          computeCurrentyStartingBalances(componentState, cookie.getValue(), entry);
        } else {
          finnhubClient.cryptoCandles(`BINANCE:${entry.ticker}USDT`, "D", Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60, Math.floor(Date.now() / 1000), (error: any, data: any, response: any) => {
            if (data && data.c && data.c.length >= 2) {
              const value: number = data.c[1];
              setCookie(entry.ticker, value.toString());
              computeCurrentyStartingBalances(componentState, value, entry);
            }
          });
        }

      } else {
        const stockCookie = getCookie(entry.ticker);
        if (stockCookie && stockCookie != null) {
          computeSecuritiesStartingBalances(componentState, stockCookie.getValue(), entry);
        } else {
          finnhubClient.quote(entry.ticker, (error: any, data: any, response: any) => {
            if (data && data.c) {
              const value: number = data.c;
              setCookie(entry.ticker, value.toString());
              computeSecuritiesStartingBalances(componentState, value, entry);
            }
          });
        }
      }
    } else {
      const newBrokNonStock = entry.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + entry.quantity : componentState.state.balances['brokerage'][0];
      const currTaxNonStock = entry.account === 'tax' ? componentState.state.balances['tax'][0] + entry.quantity : componentState.state.balances['tax'][0];
      componentState.setState({
        balances: {
          brokerage: {
            0: newBrokNonStock,

          },
          tax: {
            0: currTaxNonStock,
          }
        }
      })
    }

  }

}

function computeCurrentyStartingBalances(componentState: any, currentCurrencyVal: number, asset: Asset) {
  const value: number = currentCurrencyVal;
  const holdingValue = value * asset.quantity;
  const newBrokCurr = asset.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + holdingValue : componentState.state.balances['brokerage'][0];
  const currTaxCurr = asset.account === 'tax' ? componentState.state.balances['tax'][0] + holdingValue : componentState.state.balances['tax'][0];
  componentState.setState({
    balances: {
      brokerage: {
        0: newBrokCurr,

      },
      tax: {
        0: currTaxCurr,
      }
    }
  })
}

function computeSecuritiesStartingBalances(componentState: any, currentSecurityVal: number, asset: Asset) {
  const holdingValue = currentSecurityVal * asset.quantity;
  const newBrok = asset.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + holdingValue : componentState.state.balances['brokerage'][0];
  const currTax = asset.account === 'tax' ? componentState.state.balances['tax'][0] + holdingValue : componentState.state.balances['tax'][0];
  componentState.setState({
    balances: {
      brokerage: {
        0: newBrok,

      },
      tax: {
        0: currTax,
      }
    }
  })
}
