"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjection = exports.getNormalDistributionOfReturns = void 0;
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
const getProjection = (startingBalance, returns, incomesAndExpenses) => {
    const projection = [];
    let currVal = startingBalance;
    for (let i = 0; i < returns.length; i++) {
        if (i === 0) {
            projection.push(currVal + incomesAndExpenses[i]);
            continue;
        }
        currVal = currVal > 0 ? currVal + currVal * returns[i] + incomesAndExpenses[i] : 0.0;
        projection.push(currVal);
    }
    return projection;
};
exports.getProjection = getProjection;
