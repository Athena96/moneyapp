import gaussian from "gaussian"
import {
  joinDistributionsOfReturns,
  adjustForFees,
  getColumnFromMatrix,
  getIncomesAndExpenses,
  getPercentile
} from '../utils/Utils';
import {
  VTI_MEAN, VTI_VARIANCE, BND_MEAN, BND_VARIANCE,
  STOCK_P, BOND_P, SIMS, FEES, INFLATION
} from '../utils/Settings'

export const getNormalDistributionOfReturns = (mean: number, variance: number, size: number) => {
  const distribution = gaussian(mean, variance)
  let sample = distribution.random(size)
  for (let i = 0; i < sample.length; i++) {
    sample[i] = Number((sample[i] / 100.0).toFixed(3))
  }
  return sample
}

export const getProjection = (startingBalance: number, returns: number[], incomesAndExpenses: number[]) => {
  const projection: number[] = []
  let currVal = startingBalance
  for (let i = 0; i < returns.length; i++) {
    currVal = currVal > 0 ? currVal + currVal * returns[i] + incomesAndExpenses[i] : 0.0
    projection.push(currVal)
  }
  return projection
}
