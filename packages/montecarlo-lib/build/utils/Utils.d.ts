import { AnnualExpensesIncome } from "..";
export declare const median: (values: number[]) => number;
export declare const getPercentile: (values: number[], percent: number) => number;
export declare const average: (values: number[]) => number;
export declare const joinDistributionsOfReturns: (distributions: number[][], percents: number[]) => any[];
export declare const adjustForFees: (returns: number[], fees: number) => number[];
export declare const getColumnFromMatrix: (matrix: number[][], colIdx: number) => number[];
/**
 * getIncomesAndExpenses
 * @param {number} timeline
 * @param {AnnualExpensesIncome[]} incomeExpList
 * @param {number} startingAge
 * @param {Map<number,number>} oneTime
 * @returns {number[]} incomesAndExpenses
 */
export declare const getIncomesAndExpenses: (timeline: number, incomeExpList: AnnualExpensesIncome[], startingAge: number, oneTime: Map<number, number>) => number[];
