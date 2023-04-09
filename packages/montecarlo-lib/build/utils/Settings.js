"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEES = exports.VTI_VARIANCE = exports.SIMS = exports.BOND_P = exports.STOCK_P = void 0;
const ONE_MILLION = 1000000;
exports.STOCK_P = 1.0;
exports.BOND_P = 1.0 - exports.STOCK_P;
exports.SIMS = 10000;
exports.VTI_VARIANCE = 248.6929; // https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
// export const VTI_MEAN: number = 11.77 // https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
// export const BND_VARIANCE: number = 16.0801
// export const BND_MEAN: number = 4.45
exports.FEES = 0.04 / 100.0;
