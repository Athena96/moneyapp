export type AnnualExpensesIncome = {
    startAge: number;
    endAge: number;
    annualExpensesIncome: number;
};
export type MonteCarloData = {
    medianLine: number[];
    successPercent: number;
};
export declare function simulate(mean: number, variance: number, annualContribution: AnnualExpensesIncome[], numberOfYears: number, startingBalance: number, numberOfSimulations: number, startAge: number, oneTime: Map<number, number>, currentDate: Date): MonteCarloData;
