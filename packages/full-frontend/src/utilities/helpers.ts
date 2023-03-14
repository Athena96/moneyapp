import { Asset } from '../model/Base/Asset';
import { Budget } from '../model/Base/Budget';
import { Event } from '../model/Base/Event';
import { Key } from '../model/Interfaces/KeyInterface';
import { InputDataAccess } from './InputDataAccess';
import { AssetDataAccess } from './AssetDataAccess';
import { BudgetDataAccess } from './BudgetDataAccess';
import { EventDataAccess } from './EventDataAccess';

import { CategoryTypes } from '../API';
import { AnnualExpensesIncome, simulate } from 'montecarlo-lib';

export interface MonteCarloRowData {
  date: Date;
  maxBalance?: string;
  avgBalance?: string;
  assumedAvgBalance?: string;
  minBalance?: string;
  return: string;
  note: string;
  events?: Event[];
  assumedAvgBalanceBrok: string;
  assumedAvgBalanceTax: string;
  incomeExpenses?: string;
}

// actual general helpers
export function dateRange(startAge: number, endAge: number, steps = 31) {
  // const dateArray = [];
  // let currentDate = new Date(startAge);
  // currentDate.setDate(currentDate.getDate() + 1);
  
  // while (currentDate <= new Date(endAge)) {
  //   dateArray.push(new Date(currentDate));
  //   var month = currentDate.getMonth() + 1; // increment the month
  //   var year = month === 0 ? currentDate.getFullYear() + 1 : currentDate.getFullYear(); // if it incremented to January, then increment the year.
  //   currentDate = new Date(year, month, 1);
  // }

  // return dateArray;
  return endAge - startAge
}


// function getRandom(min: any, max: any) {
//   return Math.random() * (max - min) + min;
// }

// function shuffleArray<T>(array: T[]): T[] {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     const temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
//   }
//   return array;
// }

// export function getRandomHistoricalData(size: number, returnType: string) {

//   let returnIdxHistory: number[] = []
//   const MONTHLY_GROWTH_IDX = 1;
//   let returnData: number[] = [];
//   for (let i = 0; i < size; i += 1) {

//     let randomIdx = 0;
//     while (true) {
//       randomIdx = Math.floor(Math.random() * sp500Data.length);
//       if (returnIdxHistory.includes(randomIdx)) {
//         continue;
//       } else {
//         returnIdxHistory.push(randomIdx);
//         break;
//       }
//     }
    
//     const randReturn = sp500Data[randomIdx][MONTHLY_GROWTH_IDX];
//     const finalReturn = returnType === 'safe' ? randReturn * 0.5719794344 : randReturn;
//     returnData.push(finalReturn);
//   }

//   return returnData;

// }


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

// export function getFinnhubClient() {
//   const finnhub = require('finnhub');
//   const api_key = finnhub.ApiClient.instance.authentications['api_key'];
//   delete finnhub.ApiClient.instance.defaultHeaders['User-Agent'];
//   api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
//   return new finnhub.DefaultApi()
// }

export class StockClient {
  finnhubClient: any;

  constructor() {
    const finnhub = require('finnhub');
      const api_key = finnhub.ApiClient.instance.authentications['api_key'];
      delete finnhub.ApiClient.instance.defaultHeaders['User-Agent'];
      api_key.apiKey = "c56e8vqad3ibpaik9s20"
      this.finnhubClient = new finnhub.DefaultApi()
  }


  getQuotes = async (stock: Asset): Promise<number> => {
      return new Promise((resolve, reject) => {
          this.finnhubClient.quote(stock.ticker, (error: any, data: any, response: any) => {
              if (data && data.c) {
                  const value = data.c;
                  resolve(Number(value));
              } else {
                  reject('err getQuotes')
              }
          });
      })
  }
}

export function getActiveBudgets(age: number, budgets: Budget[]) {
  let currentBudgets: Budget[] = [];
  for (const budget of budgets) {
      if (age >= budget.startAge && age <= budget.endAge) {
          currentBudgets.push(budget);
      }
  }
  return currentBudgets;
}

export const getIncomeExpenseFromBuget = (budget: Budget) => {
  let v = 0
  for (const c of budget.categories) {
    if (budget.type === CategoryTypes.Expense) {
      v -= c.getValue()
    } else {
      v += c.getValue()

    }
  }
  return v
}

export const getAnnualSpendingIncome = ( budgets: Budget[]) => {
  
  const expIncome = []
  for (const budget of budgets) {
    expIncome.push({
      startAge: budget.startAge,
      endAge: budget.endAge,
      annualExpensesIncome: getIncomeExpenseFromBuget(budget)
    })
  }
  return expIncome
}

export const convertEventsToMap = (events: Event[]) => {
  const m = new Map<number,number>();
  for (const event of events) {
    if (event.type === CategoryTypes.Expense) {
      m.set(event.age, (m.get(event.age) || 0.0) - event.category.getValue())

    } else {
      m.set(event.age, (m.get(event.age) || 0.0) + event.category.getValue())

    }
  }
  return m
}

export const getStartingBalance = async (assets: Asset[], stockClient: StockClient) => {
  let startingBalance = 0.0
  for (const asset of assets) {

      if (asset.hasIndexData) {
        const price = await stockClient.getQuotes(asset)
        const val = price * asset.quantity
        startingBalance += val
      } else {
        startingBalance += asset.quantity

      }

  }
  console.log('startingBalance ' + startingBalance)
  return startingBalance
}

export const getMonteCarloProjection = async (simulation: string) => {

  const st_datafetch = new Date()
  const assets = await AssetDataAccess.fetchAssetsForSelectedSim(simulation);
  const defaultInputs = await InputDataAccess.fetchInputsForSelectedSim(simulation);
  const budgets = await BudgetDataAccess.fetchBudgetsForSelectedSim(simulation);
  const events = await EventDataAccess.fetchEventsForSelectedSim(simulation);
  const ed_datafetch = new Date()
  console.log(`DATA Fetch TIME: ${ed_datafetch.getTime() - st_datafetch.getTime()}`);

  const annualExpenseList: AnnualExpensesIncome[] = getAnnualSpendingIncome(budgets)

  const st_stbal = new Date()
  const stockClient = new StockClient();
  const startingBalance = await getStartingBalance(assets, stockClient)
  const ed_stbal = new Date()

  console.log(`ST BAL TIME: ${ed_stbal.getTime() - st_stbal.getTime()}`);

  const period = 95 - defaultInputs.age
  const startAge = defaultInputs.age
  const oneTime = convertEventsToMap(events)

  const st_sim = new Date();
  const monteCarloData = simulate(
    period,
    annualExpenseList,
    startingBalance,
    startAge,
    oneTime)
  const ed_sim = new Date();
  console.log(`SIM TIME: ${ed_sim.getTime() - st_sim.getTime()}`);

  return monteCarloData;
}