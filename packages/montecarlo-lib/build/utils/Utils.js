"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncomesAndExpenses = exports.getColumnFromMatrix = exports.adjustForFees = exports.joinDistributionsOfReturns = exports.average = exports.getPercentile = exports.median = void 0;
const median = (values) => {
    if (values.length === 0)
        throw new Error("No inputs");
    var half = Math.floor(values.length / 2);
    if (values.length % 2)
        return values[half];
    return (values[half - 1] + values[half]) / 2.0;
};
exports.median = median;
const getPercentile = (values, percent) => {
    const percentileIdx = Math.floor(values.length * percent);
    return values[percentileIdx];
};
exports.getPercentile = getPercentile;
const average = (values) => {
    const sum = values.reduce((a, b) => a + b);
    return sum / values.length;
};
exports.average = average;
const joinDistributionsOfReturns = (distributions, percents) => {
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
    if (percentSum !== 1)
        throw new Error(`percents: ${percentSum} does not sum to 100%`);
    return effectiveReturns;
};
exports.joinDistributionsOfReturns = joinDistributionsOfReturns;
const adjustForFees = (returns, fees) => {
    const adjustedReturns = [];
    for (let i = 0; i < returns.length; i++) {
        adjustedReturns.push(Number((returns[i] - fees).toFixed(3)));
    }
    return adjustedReturns;
};
exports.adjustForFees = adjustForFees;
const getColumnFromMatrix = (matrix, colIdx) => {
    const col = [];
    for (let i = 0; i < matrix.length; i++) {
        col.push(matrix[i][colIdx]);
    }
    return col;
};
exports.getColumnFromMatrix = getColumnFromMatrix;
/**
 * getIncomesAndExpenses
 * @param {number} timeline
 * @param {AnnualExpensesIncome[]} incomeExpList
 * @param {number} startingAge
 * @param {Map<number,number>} oneTime
 * @returns {number[]} incomesAndExpenses
 */
const getIncomesAndExpenses = (timeline, incomeExpList, startingAge, oneTime) => {
    const incomesAndExpenses = [];
    for (let i = 0; i < timeline; i++) {
        const currAge = startingAge + i;
        const oneTimeExpensesIncome = oneTime.get(currAge) || 0.0;
        let sum = oneTimeExpensesIncome;
        for (const incomeExp of incomeExpList) {
            if (currAge >= incomeExp.startAge && currAge <= incomeExp.endAge) {
                sum += Number((incomeExp.annualExpensesIncome).toFixed(2));
            }
        }
        incomesAndExpenses.push(sum);
    }
    return incomesAndExpenses;
};
exports.getIncomesAndExpenses = getIncomesAndExpenses;
