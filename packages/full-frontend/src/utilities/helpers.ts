import { Asset } from "../model/Base/Asset";
import { Budget } from "../model/Base/Budget";
import { Event } from "../model/Base/Event";
import { Key } from "../model/Interfaces/KeyInterface";
import { InputDataAccess } from "./InputDataAccess";

import { CategoryTypes } from "../API";
import { AnnualExpensesIncome, simulate } from "montecarlo-lib";

export const END_AGE = 95;

export function cleanNumberDataInput(input: string) {
  return input.replace(/[^\d.-]/g, "");
}

export function getObjectWithId(idToFind: string, keyObjects: Key[]) {
  for (const obj of keyObjects) {
    if (obj.getKey() === idToFind) {
      return obj;
    }
  }
}

export class StockClient {
  finnhubClient: any;

  constructor() {
    const finnhub = require("finnhub");
    const api_key = finnhub.ApiClient.instance.authentications["api_key"];
    delete finnhub.ApiClient.instance.defaultHeaders["User-Agent"];
    api_key.apiKey = "c56e8vqad3ibpaik9s20";
    this.finnhubClient = new finnhub.DefaultApi();
  }

  getQuotes = async (stock: Asset): Promise<number> => {
    return new Promise((resolve, reject) => {
      this.finnhubClient.quote(stock.ticker, (error: any, data: any, response: any) => {
        if (data && data.c) {
          const value = data.c;
          resolve(Number(value));
        } else {
          reject("err getQuotes");
        }
      });
    });
  };
}

export const getOneTimeContribWithdrawlTimeline = (startAge: number, events: Event[]): Map<number, number> => {
  const oneTimeContribWithDrawlMap = new Map<number, number>();
  for (let i = startAge; i <= END_AGE; i += 1) {
    const activeEvents = getActiveEvents(i, events);
    const onetimeContribWithdrawl = getEventsSum(activeEvents);
    oneTimeContribWithDrawlMap.set(i, onetimeContribWithdrawl);
  }
  return oneTimeContribWithDrawlMap;
};

export const getRecurringContribWithdrawlTimeline = (startAge: number, budgets: Budget[]): Map<number, number> => {
  const recurringContribWithDrawlMap = new Map<number, number>();
  for (let i = startAge; i <= END_AGE; i += 1) {
    const activeBudgets = getActiveBudgets(i, budgets);
    const recurringContribWithdrawl = getBudgetsSum(activeBudgets) * 12.0;
    recurringContribWithDrawlMap.set(i, recurringContribWithdrawl);
  }
  return recurringContribWithDrawlMap;
};

export const getBudgetsSum = (budgets: Budget[]) => {
  let sum = 0;
  budgets.forEach((budget) => {
    sum += getIncomeExpenseFromBuget(budget);
  });

  return sum;
};

export const getEventsSum = (events: Event[]) => {
  let sum = 0;
  for (const event of events) {
    if (event.type === CategoryTypes.Income) {
      sum += event.category.value;
    } else {
      sum -= event.category.value;
    }
  }
  return sum;
};

export function getActiveBudgets(age: number, budgets: Budget[]) {
  let currentBudgets: Budget[] = [];
  for (const budget of budgets) {
    if (age >= budget.startAge && age <= budget.endAge) {
      currentBudgets.push(budget);
    }
  }
  return currentBudgets;
}

export function getActiveEvents(age: number, events: Event[]) {
  let currentEvents: Event[] = [];
  for (const event of events) {
    if (age === event.age) {
      currentEvents.push(event);
    }
  }
  return currentEvents;
}

export const getIncomeExpenseFromBuget = (budget: Budget) => {
  let v = 0;
  for (const c of budget.categories) {
    if (budget.type === CategoryTypes.Expense) {
      v -= c.getValue();
    } else {
      v += c.getValue();
    }
  }
  return v;
};

export const getAnnualSpendingIncome = (budgets: Budget[]): AnnualExpensesIncome[] => {
  const expIncome = [];
  for (const budget of budgets) {
    expIncome.push({
      startAge: budget.startAge,
      endAge: budget.endAge,
      annualExpensesIncome: getIncomeExpenseFromBuget(budget) * 12.0,
    });
  }
  return expIncome;
};

export const convertEventsToMap = (events: Event[]) => {
  const m = new Map<number, number>();
  for (const event of events) {
    if (event.type === CategoryTypes.Expense) {
      m.set(event.age, (m.get(event.age) || 0.0) - event.category.getValue());
    } else {
      m.set(event.age, (m.get(event.age) || 0.0) + event.category.getValue());
    }
  }
  return m;
};

export const getStartingBalance = async (assets: Asset[], stockClient: StockClient) => {
  let startingBalance = 0.0;
  for (const asset of assets) {
    if (asset.hasIndexData) {
      const price = await stockClient.getQuotes(asset);
      const val = price * asset.quantity;
      startingBalance += val;
    } else {
      startingBalance += asset.quantity;
    }
  }
  return startingBalance;
};

export const getMonteCarloProjection = async (
  simulation: string,
  startingBalance: number,
  budgets: Budget[],
  events: Event[]
) => {
  const st_datafetch = new Date();
  const defaultInputs = await InputDataAccess.fetchInputsForSelectedSim(simulation);
  const ed_datafetch = new Date();
  console.log(`DATA Fetch TIME: ${ed_datafetch.getTime() - st_datafetch.getTime()}`);

  const annualExpenseList: AnnualExpensesIncome[] = getAnnualSpendingIncome(budgets);

  const st_stbal = new Date();
  const ed_stbal = new Date();

  console.log(`ST BAL TIME: ${ed_stbal.getTime() - st_stbal.getTime()}`);

  const period = END_AGE - defaultInputs.age;
  const startAge = defaultInputs.age;
  const oneTime = convertEventsToMap(events);
  const sp500Variance: number = 248.6929; // https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
  const inflationAdjustedMean = defaultInputs.annualAssetReturnPercent - defaultInputs.annualInflationPercent;
  const st_sim = new Date();
  const monteCarloData = simulate(
    inflationAdjustedMean,
    sp500Variance,
    annualExpenseList,
    period,
    startingBalance,
    10000,
    startAge,
    oneTime,
    new Date()
  );
  const ed_sim = new Date();
  console.log(`SIM TIME: ${ed_sim.getTime() - st_sim.getTime()}`);

  return monteCarloData;
};
