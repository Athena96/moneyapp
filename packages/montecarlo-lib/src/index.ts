import { getNormalDistributionOfReturns, calculateFutureValue } from "./services/MonteCarlo";
import { FEES, SIMS } from "./utils/Settings";
import { adjustForFees, getColumnFromMatrix, getIncomesAndExpenses, getPercentile } from "./utils/Utils";

export type AnnualExpensesIncome = {
  startAge: number;
  endAge: number;
  annualExpensesIncome: number;
};
export type MonteCarloData = {
  medianLine: number[];
  successPercent: number;
};

export function simulate(
  mean: number,
  variance: number,
  annualContribution: AnnualExpensesIncome[],
  numberOfYears: number,
  startingBalance: number,
  numberOfSimulations: number,
  startAge: number,
  oneTime: Map<number, number>,
  currentDate: Date
): MonteCarloData {
  console.log("currentDate.getMonth() ", currentDate.getMonth());

  const current_year_progress = (currentDate.getMonth()+1) / 12.0;
  console.log("current_year_progress", current_year_progress);
  // const successCountByAge = new Array(numberOfYears).fill(0)
  let successCount = 0;
  const simulationData: number[][] = new Array(SIMS);
  for (let i = 0; i < numberOfSimulations; i++) {
    // generate distributions of returns
    const distributionOfReturns = getNormalDistributionOfReturns(mean, variance, numberOfYears);
    const effectiveDistOfReturns = adjustForFees(distributionOfReturns, FEES);

    // setup income and expenses
    const incomesAndExpenses = getIncomesAndExpenses(numberOfYears, annualContribution, startAge, oneTime);

    // generate projection
    const projection = calculateFutureValue(startingBalance, effectiveDistOfReturns, incomesAndExpenses, current_year_progress);

    // save data for median
    simulationData[i] = [];
    for (let id = 0; id < projection.length; id++) {
      simulationData[i].push(projection[id]);
    }

    // success percent
    if (projection[projection.length - 1] > 0) {
      successCount += 1;
    }
  }

  const twoFive: number[] = [];
  const medLine: number[] = [];
  const sevenFive: number[] = [];
  const nineFive: number[] = [];

  for (let k = 0; k < numberOfYears; k++) {
    const col = getColumnFromMatrix(simulationData, k);
    col.sort((a, b) => a - b);

    const adjCol = [];
    for (let l = 0; l < col.length; l++) {
      adjCol.push(col[l]);
    }

    const tf = getPercentile(adjCol, 0.25);
    const med = getPercentile(adjCol, 0.5);
    const sf = getPercentile(adjCol, 0.75);
    const nf = getPercentile(adjCol, 0.95);
    twoFive.push(tf);
    medLine.push(med);
    sevenFive.push(sf);
    nineFive.push(nf);
  }

  return {
    medianLine: medLine,
    successPercent: (successCount / SIMS) * 100.0,
  };
}
