

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Category } from '../model/Category';


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
    budgetSpending.push(new Category('rent', 1520.0, 0, null));
    budgetSpending.push(new Category('apple music', 9.99, 0, null));

    let amznSDEy2Budget = new Budget('amzn sde y2', new Date('01/27/2021'), new Date('01/27/2022'), budgetSpending);

    budgets.push(amznSDEy2Budget);

    return budgets;
  }