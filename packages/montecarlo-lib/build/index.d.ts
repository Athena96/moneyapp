export type AnnualExpensesIncome = {
    startAge: number;
    endAge: number;
    annualExpensesIncome: number;
};
export type MonteCarloData = {
    medianLine: number[];
    successPercent: number;
};
export declare function simulate(period: number, annualContribution: AnnualExpensesIncome[], startingBalance: number, startAge: number, oneTime: Map<number, number>): MonteCarloData;
