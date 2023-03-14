"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEES = exports.INFLATION = exports.BND_MEAN = exports.BND_VARIANCE = exports.VTI_MEAN = exports.VTI_VARIANCE = exports.SIMS = exports.BOND_P = exports.STOCK_P = void 0;
const ONE_MILLION = 1000000;
exports.STOCK_P = 1.0;
exports.BOND_P = 1.0 - exports.STOCK_P;
exports.SIMS = 10000;
exports.VTI_VARIANCE = 248.6929; // https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
exports.VTI_MEAN = 11.77; // https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
exports.BND_VARIANCE = 16.0801;
exports.BND_MEAN = 4.45;
exports.INFLATION = 3.96 / 100.0;
exports.FEES = 0.04 / 100.0;
