"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulate = void 0;
const MonteCarlo_1 = require("./services/MonteCarlo");
const Settings_1 = require("./utils/Settings");
const Utils_1 = require("./utils/Utils");
function simulate(mean, variance, annualContribution, numberOfYears, startingBalance, numberOfSimulations, startAge, oneTime, currentDate) {
    console.log("MonteCarloLib.simulate()");
    console.log(`period: ${numberOfYears}`);
    console.log(`startingBalance: ${startingBalance}`);
    console.log(`startAge: ${startAge}`);
    console.log(`annualContribution: ${JSON.stringify(annualContribution)}`);
    console.log(`oneTime:`);
    console.log(oneTime);
    const current_year_progress = (currentDate.getMonth() + 1) / 12.0;
    console.log(`current_year_progress: ${current_year_progress}`);
    // const successCountByAge = new Array(numberOfYears).fill(0)
    let successCount = 0;
    const simulationData = new Array(Settings_1.SIMS);
    for (let i = 0; i < numberOfSimulations; i++) {
        // generate distributions of returns
        const distributionOfReturns = (0, MonteCarlo_1.getNormalDistributionOfReturns)(mean, variance, numberOfYears);
        const effectiveDistOfReturns = (0, Utils_1.adjustForFees)(distributionOfReturns, Settings_1.FEES);
        // setup income and expenses
        const incomesAndExpenses = (0, Utils_1.getIncomesAndExpenses)(numberOfYears, annualContribution, startAge, oneTime);
        // console.log(`incomesAndExpenses: ${JSON.stringify(incomesAndExpenses)}`);
        // generate projection
        const projection = (0, MonteCarlo_1.calculateFutureValue)(startingBalance, effectiveDistOfReturns, incomesAndExpenses, current_year_progress);
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
    const twoFive = [];
    const medLine = [];
    const sevenFive = [];
    const nineFive = [];
    for (let k = 0; k < numberOfYears; k++) {
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
    return {
        medianLine: medLine,
        successPercent: (successCount / Settings_1.SIMS) * 100.0,
    };
}
exports.simulate = simulate;
