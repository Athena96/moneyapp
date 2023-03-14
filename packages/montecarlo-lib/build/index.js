"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulate = void 0;
const MonteCarlo_1 = require("./services/MonteCarlo");
const Settings_1 = require("./utils/Settings");
const Utils_1 = require("./utils/Utils");
function simulate(period, annualContribution, startingBalance, startAge, oneTime) {
    console.log('RUN MY SIM FROM LIB');
    const successCountByAge = new Array(period).fill(0);
    const simulationData = new Array(Settings_1.SIMS);
    for (let i = 0; i < Settings_1.SIMS; i++) {
        // generate distributions of returns
        const stockDistributionOfReturns = (0, MonteCarlo_1.getNormalDistributionOfReturns)(Settings_1.VTI_MEAN, Settings_1.VTI_VARIANCE, period);
        const bondDistributionOfReturns = (0, MonteCarlo_1.getNormalDistributionOfReturns)(Settings_1.BND_MEAN, Settings_1.BND_VARIANCE, period);
        const blendedReturns = (0, Utils_1.joinDistributionsOfReturns)([stockDistributionOfReturns, bondDistributionOfReturns], [Settings_1.STOCK_P, Settings_1.BOND_P]);
        const effectiveDistOfReturns = (0, Utils_1.adjustForFees)(blendedReturns, Settings_1.FEES, Settings_1.INFLATION);
        // setup income and expenses
        const incomesAndExpenses = (0, Utils_1.getIncomesAndExpenses)(period, annualContribution, startAge, oneTime);
        // generate projection
        const projection = (0, MonteCarlo_1.getProjection)(startingBalance, effectiveDistOfReturns, incomesAndExpenses);
        // save data for median
        simulationData[i] = [];
        for (let id = 0; id < projection.length; id++) {
            simulationData[i].push(projection[id]);
        }
        // success percent by age
        for (let y = 0; y < projection.length; y++) {
            if (projection[y] > 0) {
                successCountByAge[y] += 1;
            }
        }
    }
    const twoFive = [];
    const medLine = [];
    const sevenFive = [];
    const nineFive = [];
    for (let k = 0; k < period; k++) {
        const col = (0, Utils_1.getColumnFromMatrix)(simulationData, k);
        col.sort((a, b) => a - b);
        const adjCol = [];
        for (let l = 0; l < col.length; l++) {
            adjCol.push(col[l]);
        }
        const tf = (0, Utils_1.getPercentile)(adjCol, 0.25);
        const med = (0, Utils_1.getPercentile)(adjCol, 0.5);
        const sf = (0, Utils_1.getPercentile)(adjCol, 0.75);
        const nf = (0, Utils_1.getPercentile)(adjCol, 0.95);
        twoFive.push(tf);
        medLine.push(med);
        sevenFive.push(sf);
        nineFive.push(nf);
    }
    const successPercentByAge = new Array(period).fill(0);
    for (let k = 0; k < period; k++) {
        successPercentByAge[k] = ((successCountByAge[k] / Settings_1.SIMS) * 100.0);
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
        successPercent: successPercentByAge[successPercentByAge.length - 1]
    };
}
exports.simulate = simulate;
