import gaussian from "gaussian";

export const getNormalDistributionOfReturns = (mean: number, variance: number, size: number) => {
  const distribution = gaussian(mean, variance);
  let sample = distribution.random(size);
  for (let i = 0; i < sample.length; i++) {
    sample[i] = Number((sample[i] / 100.0).toFixed(3));
  }
  return sample;
};

export const calculateFutureValue = (
  startingBalance: number,
  annualInterestRates: number[],
  annualIncomesAndExpenses: number[],
  current_year_progress: number
) => {
  const remaining_year_progress = 1.0 - current_year_progress;
  const projection: number[] = [];
  let futureValue = startingBalance;
  for (let i = 0; i < annualInterestRates.length; i++) {
    if (i === 0) {
      futureValue = futureValue + futureValue * annualInterestRates[i] + annualIncomesAndExpenses[i] * remaining_year_progress;
    } else {
      futureValue = futureValue + futureValue * annualInterestRates[i] + annualIncomesAndExpenses[i];
    }
    projection.push(futureValue);
  }
  return projection;
};
