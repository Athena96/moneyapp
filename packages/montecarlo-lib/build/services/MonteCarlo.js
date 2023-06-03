"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFutureValue = exports.getNormalDistributionOfReturns = void 0;
const gaussian_1 = __importDefault(require("gaussian"));
const getNormalDistributionOfReturns = (mean, variance, size) => {
    const distribution = (0, gaussian_1.default)(mean, variance);
    let sample = distribution.random(size);
    for (let i = 0; i < sample.length; i++) {
        sample[i] = Number((sample[i] / 100.0).toFixed(3));
    }
    return sample;
};
exports.getNormalDistributionOfReturns = getNormalDistributionOfReturns;
const calculateFutureValue = (startingBalance, annualInterestRates, annualIncomesAndExpenses, current_year_progress) => {
    const remaining_year_progress = 1.0 - current_year_progress;
    const projection = [];
    let futureValue = startingBalance;
    for (let i = 0; i < annualInterestRates.length; i++) {
        if (i === 0) {
            futureValue = futureValue + futureValue * annualInterestRates[i] + annualIncomesAndExpenses[i] * remaining_year_progress;
        }
        else {
            futureValue = futureValue + futureValue * annualInterestRates[i] + annualIncomesAndExpenses[i];
        }
        projection.push(futureValue);
    }
    return projection;
};
exports.calculateFutureValue = calculateFutureValue;
