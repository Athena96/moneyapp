
import { AnnualExpensesIncome } from '..';
import { getIncomesAndExpenses } from '../utils/Utils';

describe('getIncomesAndExpenses', () => {
  it('should calculate incomes and expenses correctly', () => {
    const timeline = 10;
    const incomeExpList: AnnualExpensesIncome[] = [
      { startAge: 20, endAge: 25, annualExpensesIncome: 2000 },
      { startAge: 26, endAge: 30, annualExpensesIncome: 2500 }
    ];
    const startingAge = 20;
    const oneTime = new Map<number, number>();
    oneTime.set(21, 1000);
    oneTime.set(25, 1500);

    const expectedIncomesAndExpenses = [2000, 3000, 2000, 2000, 2000, 3500, 2500, 2500, 2500, 2500];

    const result = getIncomesAndExpenses(timeline, incomeExpList, startingAge, oneTime);

    expect(result).toEqual(expectedIncomesAndExpenses);
  });
});
