

import { Event } from '../model/Event';

import { Category } from '../model/Category';

import { CategoryTypes } from '../API';

const INVEST_SIGNON_BROK = 6417.26;
const INVEST_BROK = 5136.02;

const INVEST_SIGNON_TAX = 490.33 + 245.17;
const INVEST_TAX = 490.33 + 245.17;

const HOUSE_DP = 55000;

const CAR_DP = 2300;

export function getEvents(amznStock: number) {

    let events = [];

    // 2021
    events.push(new Event('', '', new Date('10/27/2021'), 'brokerage', new Category('', 'invest', INVEST_SIGNON_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('11/27/2021'), 'brokerage', new Category('', 'invest', INVEST_SIGNON_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('12/27/2021'), 'brokerage', new Category('', 'invest', INVEST_SIGNON_BROK, CategoryTypes.Income)));

    events.push(new Event('', '', new Date('10/27/2021'), 'tax', new Category('', 'invest', INVEST_SIGNON_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('11/27/2021'), 'tax', new Category('', 'invest', INVEST_SIGNON_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('12/27/2021'), 'tax', new Category('', 'invest', INVEST_SIGNON_TAX, CategoryTypes.Income)));

    events.push(new Event('', '-$400 Moondog neuter', new Date('10/22/2021'), 'brokerage', new Category('', '-$400 Moondog neuter', 400.0, CategoryTypes.Expense)));
    events.push(new Event('', '-$450 Catch up', new Date('10/22/2021'), 'brokerage', new Category('', '-$450 Catch up', 450.0, CategoryTypes.Expense)));
    events.push(new Event('', 'Moving Expenses $250', new Date('12/22/2021'), 'brokerage', new Category('', 'Moving Expenses $250', 250.0, CategoryTypes.Expense)));
    events.push(new Event('', 'Christmas $140', new Date('12/22/2021'), 'brokerage', new Category('', 'Christmas $140', 140.0, CategoryTypes.Expense)));


    // 2022
    events.push(new Event('', '', new Date('1/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('2/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('3/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('4/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('5/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('6/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('7/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('8/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('9/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('10/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('11/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('12/27/2022'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));

    events.push(new Event('', '', new Date('1/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('2/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('3/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('4/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('5/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('6/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('7/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('8/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('9/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('10/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('11/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('12/27/2022'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));

    events.push(new Event('', `earn 8 x amzn stock ${amznStock}`, new Date('01/15/2022'), 'brokerage', new Category('', 'amzn stock', (8 * amznStock) - 0.3 * (8 * amznStock), CategoryTypes.Income)));
    events.push(new Event('', 'payoff loan or vacation $1294', new Date('06/15/2022'), 'brokerage', new Category('', 'loan or vacation', 1294.0, CategoryTypes.Expense)));
    events.push(new Event('', `earn 10 x amzn stock ${amznStock}`, new Date('07/15/2022'), 'brokerage', new Category('', 'amzn stock', (10 * amznStock) - 0.3 * (10 * amznStock), CategoryTypes.Income)));
    events.push(new Event('', 'Christmas $140', new Date('12/22/2022'), 'brokerage', new Category('', 'Christmas $140', 140.0, CategoryTypes.Expense)));

    // 2023
    events.push(new Event('', '', new Date('1/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('2/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('3/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('4/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('5/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('6/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('7/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('8/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('9/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('10/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('11/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('12/27/2023'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));

    events.push(new Event('', '', new Date('1/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('2/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('3/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('4/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('5/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('6/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('7/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('8/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('9/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('10/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('11/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));
    events.push(new Event('', '', new Date('12/27/2023'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));

    events.push(new Event('', `earn 10 x amzn stock ${amznStock}`, new Date('01/15/2023'), 'brokerage', new Category('', 'amzn stock', (10 * amznStock) - 0.3 * (10 * amznStock), CategoryTypes.Income)));
    events.push(new Event('', 'payoff loan or vacation $1100.56', new Date('06/15/2023'), 'brokerage', new Category('', 'loan or vacation', 1100.56, CategoryTypes.Expense)));
    events.push(new Event('', `earn 10 x amzn stock ${amznStock}`, new Date('07/15/2023'), 'brokerage', new Category('', 'amzn stock', (10 * amznStock) - 0.3 * (10 * amznStock), CategoryTypes.Income)));
    events.push(new Event('', 'Christmas $140', new Date('12/22/2023'), 'brokerage', new Category('', 'Christmas $140', 140.0, CategoryTypes.Expense)));

    // 2024
    events.push(new Event('', '', new Date('1/27/2024'), 'brokerage', new Category('', 'invest', INVEST_BROK, CategoryTypes.Income)));

    events.push(new Event('', '', new Date('1/27/2024'), 'tax', new Category('', 'invest', INVEST_TAX, CategoryTypes.Income)));


    events.push(new Event('', `earn 10 x amzn stock ${amznStock}`, new Date('01/15/2024'), 'brokerage', new Category('', 'amzn stock', (10 * amznStock) - 0.3 * (10 * amznStock), CategoryTypes.Income)));
    events.push(new Event('', 'Retire', new Date('02/14/2024'), 'brokerage', null));


    // 2036
    events.push(new Event('', 'house DP', new Date('03/15/2036'), 'brokerage', new Category('', 'house DP', HOUSE_DP * 0.60, CategoryTypes.Expense)));
    events.push(new Event('', 'house DP', new Date('03/15/2036'), 'tax', new Category('', 'house DP', HOUSE_DP * (1 - 0.60), CategoryTypes.Expense)));

    events.push(new Event('', 'car DP', new Date('04/15/2036'), 'brokerage', new Category('', 'car DP', CAR_DP, CategoryTypes.Expense)));


    return events;

}
