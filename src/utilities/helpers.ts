import { Event } from '../model/Base/Event';
import { Budget } from '../model/Base/Budget';
import { Account } from '../model/Base/Account';
import { CategoryTypes } from "../API";
import { Key } from '../model/Interfaces/KeyInterface';
import { sp500Data } from './data/sp500Data';

const SLOW_GROWTH_RATE_ANNUAL = 0.0445; // 4.45% / year
const SLOW_GROWTH_RATE_MONTHLY = SLOW_GROWTH_RATE_ANNUAL / 12;

export interface RowData {
  date: string;
  brokerageBal: string;
  taxBal: string;
  sum: string;
  note: string;
  return: string;
  accountUsed: string;
  events?: Event[]
}

export interface MonteCarloRowData {
  date: string;
  maxBalance: string;
  avgBalance: string;
  assumedAvgBalance: string;
  minBalance: string;
  return: string;
  accountUsed: string;
  note: string;
  events?: Event[]
}

// actual general helpers
export function dateRange(startDate: Date, endDate: Date, steps = 31) {
  const dateArray = [];
  let currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1);
  
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

function getRandom(min: any, max: any) {
  return Math.random() * (max - min) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function getRandomHistoricalData(size: number, returnType: string) {

  let returnIdxHistory: number[] = []
  const MONTHLY_GROWTH_IDX = 1;
  let returnData: number[] = [];
  for (let i = 0; i < size; i += 1) {

    let randomIdx = 0;
    while (true) {
      randomIdx = Math.floor(Math.random() * sp500Data.length);
      if (returnIdxHistory.includes(randomIdx)) {
        continue;
      } else {
        returnIdxHistory.push(randomIdx);
        break;
      }
    }
    
    const randReturn = sp500Data[randomIdx][MONTHLY_GROWTH_IDX];
    const finalReturn = returnType === 'safe' ? randReturn * 0.5719794344 : randReturn;
    returnData.push(finalReturn);
  }

  return returnData;

}

export function getNormalDistributionOfReturns(size: number, mean: number, variance: number) {
  const gaussian = require('gaussian');
  const distribution = gaussian(mean, variance);
  let sample = distribution.random(size);
  return shuffleArray<number>(sample);
}

function getMonteCarloDistributionOfReturns(size: any, avg: any, min: any, max: any) {
  let arr: any[] = [];
  let tmax = max;
  let tmin = min;
  while (arr.length < size) {
    const variable1 = +getRandom(min, tmax).toFixed(1);
    let variable2 = +(avg * 2 - variable1).toFixed(1);
    if (variable2 < min) {
      tmax = max - (min - variable2);
      variable2 = min;
    } else if (variable2 > max) {
      tmin = min + (variable2 - max);
      variable2 = max;
    } else {
      tmax = max;
      tmin = min;
    }
    arr = arr.concat([variable1, variable2]);
  }
  let sumErr = arr.reduce((a, b) => a + b, 0) - avg * size;
  if (sumErr > 0) {
    arr = arr.map((x) => {
      if (x > min && sumErr > 0.001) {
        let maxReduce = x - min;
        if (maxReduce > sumErr) {
          const toReturn = +(x - sumErr).toFixed(1);
          sumErr = 0;
          return toReturn;
        } else {
          sumErr -= maxReduce;
          return min;
        }
      }
      return x;
    });
  } else {
    arr = arr.map((x) => {
      if (x < max && sumErr < -0.001) {
        let maxAdd = max - x;
        if (maxAdd > Math.abs(sumErr)) {
          const toReturn = +(x + Math.abs(sumErr)).toFixed(1);
          sumErr = 0;
          return toReturn;
        } else {
          sumErr += maxAdd;
          return max;
        }
      }
      return x;
    });
  }

  return shuffleArray<number>(arr)
}

function projectWithReturn(balances: any, events: Event[], budgets: Budget[], absoluteMonthlyGrowth: number,
  myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date, retireDate: Date, minEnd: number, dates: Date[], slowGrowRates: any[], growRates: any[]) {

  let data = dates.map((date, i) => {
    let eventDesc = "";
    let accntUsed = "";

    // for each account, compute their currentDay balance, then return the entry to put it in the table
    let finalG = "";
    let eventsApplied = []

    for (const account of myaccounts) {
      let dateToSlowGroth = new Date(2061, 5, 15); // todo get this from Inputs when I'm 65
      let growth = (date > dateToSlowGroth && account.name !== 'tax') ? slowGrowRates[i] : growRates[i];
      finalG = (growth * 100).toFixed(2).toString(); // historical data is already in monthly returns
      if (i > 0) {
        // USE or GROW the account?
        if (use(account, date, i, dateIm59, balances, retireDate)) {
          accntUsed = account.name;
          const budget = getCurrentBudget(date, budgets)!;
          const monthlySpending = budget.getTypeSum(CategoryTypes.Expense);
          const monthlyTaxes = ((monthlySpending*12/2.0)*0.15)/12.0;
          const afterSpending = balances[account.name][i - 1] - (budget.getTypeSum(CategoryTypes.Expense) + monthlyTaxes);
          balances[account.name][i] = afterSpending + growth * afterSpending + budget.getTypeSum(CategoryTypes.Income)
        } else {
          balances[account.name][i] = balances[account.name][i - 1] + growth * balances[account.name][i - 1];
          // if (balances[account.name][i - 1] <= 0.0) {
          //   balances[account.name][i] = 0.0;
          // }
        }
      }

      // Apply Events regardless if im using the account or not
      for (const event of events) {
        // if the event is to be debited from the account, and it occurs this month/year then account for it
        if (event.account === account.name) {
          if (event.date.getMonth() === date.getMonth() && event.date.getFullYear() === date.getFullYear()) {
            eventDesc += event.name;
            eventsApplied.push(event);
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
      sum: `$${(balances['brokerage'][i] + balances['tax'][i]).toFixed(2)}`,
      return: `${finalG}`,
      note: eventDesc,
      accountUsed: accntUsed,
      events: eventsApplied
    };

    return r;

  });

  return data;
}

export function generateData(balances: any, events: Event[], budgets: Budget[], absoluteMonthlyGrowth: number,
  myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date, retireDate: Date, minEnd: number) {

  // create a list of dates incrementing by 1 month
  const dates = dateRange(startDate, endDate);

  // let growRates = getMonteCarloDistributionOfReturns(dates.length, absoluteMonthlyGrowth * 12 * 100, -40.07, 40).map((o) => {
  //   return o/12.0/100.0
  // });
  // let slowGrowRates = getMonteCarloDistributionOfReturns(dates.length, 4.45, -40.07 / 2.0, 40.50 / 2.0).map((o) => {
  //   return o/12.0/100.0
  // });

  const VTIvariance = 261.0378777778;
  // https://institutional.vanguard.com/investments/product-details/fund/0970
  let growRates = getNormalDistributionOfReturns(dates.length, absoluteMonthlyGrowth * 12 * 100, VTIvariance).map((o) => {
    return o/12.0/100.0
  });
  let slowGrowRates = getNormalDistributionOfReturns(dates.length, 4.45, VTIvariance/2).map((o) => {
    return o/12.0/100.0
  });
  // let growRates = getRandomHistoricalData(dates.length, 'aggressive')
  // let slowGrowRates = getRandomHistoricalData(dates.length, 'safe')
  let data = projectWithReturn(balances, events, budgets, absoluteMonthlyGrowth,
    myaccounts, startDate, endDate, dateIm59, retireDate, minEnd, dates, slowGrowRates, growRates);

  return data;
}

export function generateAssumeAvgData(balances: any, events: Event[], budgets: Budget[], absoluteMonthlyGrowth: number,
  myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date, retireDate: Date, minEnd: number) {
  // assume the same avg return every year like I used to do.
  const dates = dateRange(startDate, endDate);
  let growRates = new Array(dates.length).fill(absoluteMonthlyGrowth);
  let slowGrowRates = new Array(dates.length).fill(SLOW_GROWTH_RATE_MONTHLY);
  let data = projectWithReturn(balances, events, budgets, absoluteMonthlyGrowth,
    myaccounts, startDate, endDate, dateIm59, retireDate, minEnd, dates, slowGrowRates, growRates);
  data[0].note = "AVERAGE";
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
      // {
      //   label: "",
      //   data: [],
      //   borderColor: "rgba(0,0,0,1)",
      //   pointBorderWidth: 1,
      //   pointRadius: 1,
      // }
    ]
  };
  let data = generateData(balances, events, budgets, absoluteMonthlyGrowth!, myaccounts, startDate!, endDate!, dateIm59!, retireDate!, minEnd!)
  data.forEach((dataRow, i) => {
    tmpChartData.labels.push(`${dataRow.date}`);
    tmpChartData.datasets[0].data.push(Number(dataRow.brokerageBal.replace('$', '')));
    tmpChartData.datasets[1].data.push(Number(dataRow.taxBal.replace('$', '')));
    // tmpChartData.datasets[2].data.push(minEnd);
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

export function getFinnhubClient() {
  const finnhub = require('finnhub');
  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  delete finnhub.ApiClient.instance.defaultHeaders['User-Agent'];
  api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
  return new finnhub.DefaultApi()
}
