import { AnnualExpensesIncome } from "..";

export const median = (values: number[]) => {
  if (values.length === 0) throw new Error("No inputs");

  var half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
};

export const getPercentile = (values: number[], percent: number) => {
  const percentileIdx = Math.floor(values.length * percent);
  return values[percentileIdx];
};

export const average = (values: number[]) => {
  const sum = values.reduce((a, b) => a + b);
  return sum / values.length;
};

export const joinDistributionsOfReturns = (distributions: number[][], percents: number[]) => {
  if (distributions.length < 1 || distributions.length !== percents.length)
    throw new Error(`parameter length mismatch`);

  let percentSum = 0;
  const effectiveReturns = new Array(distributions[0].length).fill(0.0);
  for (let i = 0; i < distributions.length; i++) {
    percentSum += percents[i];
    for (let j = 0; j < distributions[i].length; j++) {
      effectiveReturns[j] = Number((effectiveReturns[j] + distributions[i][j] * percents[i]).toFixed(3));
    }
  }

  if (percentSum !== 1) throw new Error(`percents: ${percentSum} does not sum to 100%`);

  return effectiveReturns;
};

export const adjustForFees = (returns: number[], fees: number) => {
  const adjustedReturns: number[] = [];
  for (let i = 0; i < returns.length; i++) {
    adjustedReturns.push(Number((returns[i] - fees).toFixed(3)));
  }
  return adjustedReturns;
};

export const getColumnFromMatrix = (matrix: number[][], colIdx: number) => {
  const col: number[] = [];
  for (let i = 0; i < matrix.length; i++) {
    col.push(matrix[i][colIdx]);
  }
  return col;
};

/**
 * getIncomesAndExpenses
 * @param {number} timeline
 * @param {AnnualExpensesIncome[]} incomeExpList
 * @param {number} startingAge
 * @param {Map<number,number>} oneTime
 * @returns {number[]} incomesAndExpenses
 */
export const getIncomesAndExpenses = (
  timeline: number,
  incomeExpList: AnnualExpensesIncome[],
  startingAge: number,
  oneTime: Map<number, number>
) => {
  const incomesAndExpenses = [];
  for (let i = 0; i < timeline; i++) {
    const currAge = startingAge + i;
    const oneTimeExpensesIncome = oneTime.get(currAge) || 0.0;
    let sum = 0.0;
    for (const incomeExp of incomeExpList)
      if (currAge >= incomeExp.startAge && currAge <= incomeExp.endAge)
        sum += Number((incomeExp.annualExpensesIncome + oneTimeExpensesIncome).toFixed(2));
    incomesAndExpenses.push(sum);
  }
  return incomesAndExpenses;
};
