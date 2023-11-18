
import { AnnualExpensesIncome, simulate } from "montecarlo-lib";
import { Recurring } from "../model/Base/Recurring";
import { Settings } from "../model/Base/Settings";
import { ChargeType } from "../model/Base/ChargeType";

export const END_AGE = 95;

export function cleanNumberDataInput(input: string) {
  return input.replace(/[^\d.-]/g, "");
}

export const getAnnualSpendingIncome = (recurrings: Recurring[]): AnnualExpensesIncome[] => {
  const expIncome = [];
  for (const recurring of recurrings) {
    const n = recurring.startAge === recurring.endAge ? recurring.amount : recurring.amount * 12.0
    const adjn = recurring.chargeType === ChargeType.EXPENSE ? -n : n
    expIncome.push({
      startAge: recurring.startAge,
      endAge: recurring.endAge,
      annualExpensesIncome: adjn
    });
  }
  return expIncome;
};


// /**
//  * Calculates the age of a person given their birthdate.
//  *
//  * @param birthdate - The birthdate of the person in "YYYY-MM-DD" format.
//  * @returns The age of the person in years, based on today's date.
//  *
//  * @example
//  * ```typescript
//  * const age = calculateAge("2000-01-01");  // If today's date is 2023-01-01, returns 23
//  * ```
//  */
export const calculateAge = (birthdate: string): number => {
  const birthDateObj = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();

  // Adjust age if birth month hasn't occurred this year or if it's the birth month but the day hasn't occurred
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
  }

  return age;
}

export const getMonteCarloProjection = async (
  scenarioId: string,
  startingBalance: number,
  recurrings: Recurring[],
  settings: Settings,
) => {
  const annualExpenseList: AnnualExpensesIncome[] = getAnnualSpendingIncome(recurrings);
  const currAge = calculateAge(settings.birthday.toISOString())
  const period = END_AGE - currAge;
  const oneTime = new Map<number, number>();
  const sp500Variance: number = 248.6929; // https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
  const inflationAdjustedMean = settings.annualAssetReturnPercent - settings.annualInflationPercent;
  const st_sim = new Date();
  const monteCarloData = simulate(
    inflationAdjustedMean,
    sp500Variance,
    annualExpenseList,
    period,
    startingBalance,
    10000,
    currAge,
    oneTime,
    new Date()
  );
  const ed_sim = new Date();
  console.log(`SIM TIME: ${ed_sim.getTime() - st_sim.getTime()}`);

  return monteCarloData;
};


export const formatCurrency = (amount: number): string => {
  const formattedCurrency = amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formattedCurrency;
}
