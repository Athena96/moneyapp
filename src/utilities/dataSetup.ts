

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Category, CategoryTypes } from '../model/Category';


export function getEvents() {
    let events = [];

    let amznStockCategory = new Category('amzn stock', 3500.0, 1, null);
    let amznStock = new Event('earn amzn stock', new Date('04/25/2022'), 'brokerage', amznStockCategory);

    events.push(amznStock);

    return events;

}

export function getBudgets() {
    let budgets = [];


    let budgetSpending = []

    budgetSpending.push(new Category('food-groceries', 218.03, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('date', 340.0, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('random', 50.0, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('apple tv', 5.33, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('dog', 100.0, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('seattle times', 17.29, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('iCloud + apple music', 19.98, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('cellPhone', 17.47, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('internet', 55.0, CategoryTypes.Expense, null));

    
    budgetSpending.push(new Category('rent', 1398, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('pet rent', 50, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('utilities', 130, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('electric', 41, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('student loans', 1452.5, CategoryTypes.Expense, null));
    budgetSpending.push(new Category('LTC insurance', 36.85, CategoryTypes.Expense, null));

    budgetSpending.push(new Category('saving', 6417.26, CategoryTypes.Income, null));




    let amznSDEy2Budget = new Budget('amzn sde y2', new Date('01/27/2021'), new Date('10/10/2096'), budgetSpending);

    budgets.push(amznSDEy2Budget);

    return budgets;
  }