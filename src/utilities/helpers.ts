import { Budget } from '../model/Base/Budget';
import { Event } from '../model/Base/Event';
import { Key } from '../model/Interfaces/KeyInterface';


export interface MonteCarloRowData {
  date: Date;
  maxBalance?: string;
  avgBalance?: string;
  assumedAvgBalance?: string;
  minBalance?: string;
  return: string;
  accountUsed: string;
  note: string;
  events?: Event[];
  assumedAvgBalanceBrok: string;
  assumedAvgBalanceTax: string;
  incomeExpenses?: string;
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

export function getFinnhubClient() {
  const finnhub = require('finnhub');
  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  delete finnhub.ApiClient.instance.defaultHeaders['User-Agent'];
  api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
  return new finnhub.DefaultApi()
}

export function getActiveBudgets(date: Date, budgets: Budget[]) {
  let currentBudgets: Budget[] = [];
  date.setHours(25, 0, 0); // add a day so there's the day is in the budget window (if user adds budget same day)
  for (const budget of budgets) {
      if (date >= new Date(budget.startDate.setHours(0, 0, 0)) && date <= new Date(budget.endDate.setHours(0, 0, 0))) {
          currentBudgets.push(budget);
      }
  }
  return currentBudgets;
}