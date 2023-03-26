import { getNormalDistributionOfReturns, getProjection } from "./services/MonteCarlo"
import { BND_MEAN, BND_VARIANCE, BOND_P, FEES, INFLATION, SIMS, STOCK_P, VTI_MEAN, VTI_VARIANCE } from "./utils/Settings"
import { adjustForFees, getColumnFromMatrix, getIncomesAndExpenses, getPercentile, joinDistributionsOfReturns } from "./utils/Utils"


export type AnnualExpensesIncome = {
  startAge: number,
  endAge: number,
  annualExpensesIncome: number
}
export type MonteCarloData = {
  medianLine: number[]
  successPercent: number
}

export function simulate(
  period: number, 
  annualContribution: AnnualExpensesIncome[], startingBalance: number, 
  startAge: number, 
  oneTime: Map<number,number>): MonteCarloData {
  
    console.log('RUN MY SIM FROM LIB')
    console.log(`period: ${period}`)
    console.log(`startingBalance: ${startingBalance}`)
    console.log(`startAge: ${startAge}`)
    console.log(`annualContribution: ${JSON.stringify(annualContribution)}`)
    console.log(`oneTime:`)
    console.log(oneTime)

    const successCountByAge = new Array(period).fill(0)
    const simulationData: number[][] = new Array(SIMS)
    for (let i = 0; i < SIMS; i++) {
      // generate distributions of returns
      const stockDistributionOfReturns = getNormalDistributionOfReturns(VTI_MEAN, VTI_VARIANCE, period)
      const bondDistributionOfReturns = getNormalDistributionOfReturns(BND_MEAN, BND_VARIANCE, period)
      const blendedReturns = joinDistributionsOfReturns([stockDistributionOfReturns, bondDistributionOfReturns], [STOCK_P, BOND_P])
      const effectiveDistOfReturns = adjustForFees(blendedReturns, FEES, INFLATION)
  
      // setup income and expenses
      const incomesAndExpenses = getIncomesAndExpenses(period, annualContribution, startAge, oneTime)
  
      // generate projection
      const projection = getProjection(startingBalance, effectiveDistOfReturns, incomesAndExpenses)
  
      // save data for median
      simulationData[i] = []
      for (let id = 0; id < projection.length; id++) {
        simulationData[i].push(projection[id])
      }
  
      // success percent by age
      for (let y = 0; y < projection.length; y++) {
        if (projection[y] > 0) {
          successCountByAge[y] += 1
        }
      }
    }
    const twoFive: number[] = []
    const medLine: number[] = []
    const sevenFive: number[] = []
    const nineFive: number[] = []
  
    for (let k = 0; k < period; k++) {
      const col = getColumnFromMatrix(simulationData, k)
      col.sort((a, b) => a - b)
  
      const adjCol = []
      for (let l = 0; l < col.length; l++) {
        adjCol.push(col[l])
      }
  
      const tf = getPercentile(adjCol, 0.25)
      const med = getPercentile(adjCol, 0.5)
      const sf = getPercentile(adjCol, 0.75)
      const nf = getPercentile(adjCol, 0.95)
      twoFive.push(tf)
      medLine.push(med)
      sevenFive.push(sf)
      nineFive.push(nf)
    }
  
    const successPercentByAge = new Array(period).fill(0)
    for (let k = 0; k < period; k++) {
      successPercentByAge[k] = ((successCountByAge[k] / SIMS) * 100.0)
    }
  
    // return {
    //   medianLine: medLine,
    //   successPercentByAge: successPercentByAge,
    //   twoFiveLine: twoFive,
    //   sevenFiveLine: sevenFive,
    //   nineFiveLine: nineFive,
    //   medianBalanceAtRetireAge: medLine[retireDateIdx]
    // }

    return {
      medianLine: medLine,
      successPercent: successPercentByAge[successPercentByAge.length-1]
    }
  }