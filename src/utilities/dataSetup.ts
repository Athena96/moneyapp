

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import { Category } from '../model/Category';

import { CategoryTypes } from '../API';

const INVEST_SIGNON_BROK = 6417.26;
const INVEST_BROK = 5136.02;

const INVEST_SIGNON_TAX = 490.33 + 245.17;
const INVEST_TAX = 490.33 + 245.17;

const LIFESTYLE_RENT = 1500.00;
const HOME_RENT = 1800;

const HOUSE_DP = 55000;

const CAR_DP = 2300;

const MIN_END = 561973.09;

export function getInputs() {
    return {
        growth: 10.49,
        inflation: 2.75,
        absoluteMonthlyGrowth: ((10.49 - 2.75) / 100) / 12,
        startDate: new Date(),
        endDate: new Date('12/31/2096'),
        dateIm59: new Date('4/25/2055'),
        retireDate: new Date('1/29/2024'),
        minEnd: MIN_END
    };
}

export function getAccounts() {
    let brokerage = new Account('1', 'brokerage');
    let tax = new Account('2', 'tax');
    let theaccounts: Account[] = [];
    theaccounts.push(brokerage);
    theaccounts.push(tax);
    return theaccounts;
}

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

export function getBudgets() {
    let budgets = [];

    budgets.push(getSignOnBonusBudget());
    budgets.push(getY3NoBonusBudget());

    budgets.push(getRetireSingleDuringLoan());
    budgets.push(getRetireSingleAfterLoan());

    budgets.push(getRetireFamilyB459());
    budgets.push(getRetireFamilyB459Car());
    budgets.push(getRetireFamilyAfter59());

    budgets.push(getGoldenYearsDuringHousePayment());
    budgets.push(getGoldenYearsNOPayment());

    budgets.push(getEOL());

    return budgets;
}


function getSignOnBonusBudget() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 218.03, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'date', 325.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 50.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 100.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', 1398, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 130, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'student loans', 1452.5, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'saving', 6417.26, CategoryTypes.Income));

    return new Budget('', 'getSignOnBonusBudget', new Date('01/27/2021'), new Date('12/31/2021'), budgetSpending);
}


function getY3NoBonusBudget() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 218.03, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'date', 325.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 50.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','apple/ tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 100.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', LIFESTYLE_RENT, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 130, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'student loans', 1452.5, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'saving', 5111.02, CategoryTypes.Income));

    return new Budget('', 'getY3NoBonusBudget', new Date('01/01/2022'), new Date('01/31/2024'), budgetSpending);
}

function getRetireSingleDuringLoan() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 218.03, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'date', 325.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 50.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 100.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', LIFESTYLE_RENT, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 130, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'student loans', 1411.08, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Health insurance', 75.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Venture', 125.00, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'MISC_TAXES', 200.00 / 12, CategoryTypes.Expense));

    return new Budget('', 'getRetireSingleDuringLoan', new Date('02/01/2024'), new Date('02/31/2027'), budgetSpending);
}

function getRetireSingleAfterLoan() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 227.11, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'date', 300.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 50.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 100.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'gym', 30.75, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', LIFESTYLE_RENT, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 125.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','student loans', 1411.08, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Health insurance', 75.00, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'Travel', 355.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Venture', 125.00, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'MISC_TAXES', 200.00 / 12, CategoryTypes.Expense));

    return new Budget('', 'getRetireSingleAfterLoan', new Date('03/01/2027'), new Date('04/31/2036'), budgetSpending);
}

function getRetireFamilyB459Car() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 485.88, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'food-out', 160.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','date', 300.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 120.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 75.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','gym', 30.75, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', HOME_RENT, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 120.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','student loans', 1411.08, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Health insurance', 355.00, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'Travel', 125.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Venture', 125.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Car', 120.0, CategoryTypes.Expense)); // till 2041

    // budgetSpending.push(new Category('','MISC_TAXES', 200.00, CategoryTypes.Expense));

    return new Budget('', 'getRetireFamilyB459Car', new Date('05/01/2036'), new Date('04/31/2041'), budgetSpending);
}

function getRetireFamilyB459() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 485.88, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'food-out', 160.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','date', 300.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 120.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 75.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','gym', 30.75, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', HOME_RENT, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 120.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','student loans', 1411.08, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Health insurance', 355.00, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'Travel', 125.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Venture', 125.00, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Car', 120.0, CategoryTypes.Expense)); // till 2041

    // budgetSpending.push(new Category('','MISC_TAXES', 200.00, CategoryTypes.Expense));

    return new Budget('', 'getRetireFamilyB459', new Date('05/01/2041'), new Date('04/31/2055'), budgetSpending);
}

function getRetireFamilyAfter59() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 485.88, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'food-out', 160.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','date', 300.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 120.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 75.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','gym', 30.75, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', HOME_RENT, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 120.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','student loans', 1411.08, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Health insurance', 355.00, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'Travel', 125.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Venture', 125.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Car', 120.0, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'TAXES (401k)', 5730.79 / 12, CategoryTypes.Expense));

    return new Budget('', 'getRetireFamilyAfter59', new Date('05/01/2055'), new Date('04/31/2058'), budgetSpending);
}

function getGoldenYearsDuringHousePayment() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 268.39, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'food-out', 118.80, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','date', 300.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 115.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'amc sub', 23.5, CategoryTypes.Expense));

    // budgetSpending.push(new Category('','apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 100.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'gym', 30.75, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', HOME_RENT, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 120.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','student loans', 1411.08, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Health insurance', 355.00, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'Travel', 150.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Venture', 125.00, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Car', 120.0, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'TAXES (401k)', 3307.98 / 12, CategoryTypes.Expense));

    return new Budget('', 'getGoldenYearsDuringHousePayment', new Date('05/01/2058'), new Date('04/31/2066'), budgetSpending);
}

function getGoldenYearsNOPayment() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 268.39, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'food-out', 118.80, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','date', 300.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 115.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'amc sub', 23.5, CategoryTypes.Expense));

    // budgetSpending.push(new Category('','apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 100.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'gym', 30.75, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', 500, CategoryTypes.Expense)); // payed off house, for taxes/repairs
    // budgetSpending.push(new Category('','pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 120.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','student loans', 1411.08, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Health insurance', 355.00, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'Travel', 150.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Venture', 125.00, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Car', 120.0, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'TAXES (401k)', 3307.98 / 12, CategoryTypes.Expense));

    return new Budget('', 'getGoldenYearsNOPayment', new Date('05/01/2066'), new Date('04/31/2082'), budgetSpending);
}


function getEOL() {
    let budgetSpending = []
    budgetSpending.push(new Category('', 'food-groceries', 268.39, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'food-out', 118.80, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','date', 300.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'random', 75.0, CategoryTypes.Expense));

    // budgetSpending.push(new Category('','apple tv', 5.33, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'dog', 100.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','seattle times', 17.29, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'iCloud + apple music', 19.98, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'cellPhone', 17.47, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'internet', 55.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','gym', 30.75, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'rent', 500, CategoryTypes.Expense)); // payed off house, for taxes/repairs
    // budgetSpending.push(new Category('','pet rent', 50, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'utilities', 120.00, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'electric', 41, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','student loans', 1411.08, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'LTC insurance', 36.85, CategoryTypes.Expense));
    budgetSpending.push(new Category('', 'Health insurance', 355.00, CategoryTypes.Expense));

    // budgetSpending.push(new Category('','Travel', 150.0, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Venture', 125.00, CategoryTypes.Expense));
    // budgetSpending.push(new Category('','Car', 120.0, CategoryTypes.Expense));

    budgetSpending.push(new Category('', 'TAXES', 100 / 12, CategoryTypes.Expense));

    return new Budget('', 'getEOL', new Date('05/01/2082'), new Date('12/31/2096'), budgetSpending);
}
