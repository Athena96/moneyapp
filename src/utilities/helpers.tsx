import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';
import { Category } from '../model/Category';
import { CategoryTypes } from "../API";

import { API } from 'aws-amplify'
import { listAccounts } from '../graphql/queries'
import { ListAccountsQuery } from "../API";
import { ListBudgetsQuery } from "../API";
import { listBudgets } from '../graphql/queries'
import { listInputs } from '../graphql/queries';
import { ListInputsQuery } from '../API';
import { listEvents } from '../graphql/queries'
import { ListEventsQuery } from "../API";

export interface RowData {
  date: string;
  brokerageBal: string;
  taxBal: string;
  note: string;
  accountUsed: string;
}

export function dateRange(startDate: Date, endDate: Date, steps = 30) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

export function getCurrentBudget(date: Date, budgets: Budget[]) {
  for (const budget of budgets) {
    if (date >= budget.startDate && date <= budget.endDate) {
      return budget;
    }
  }
}

export function use(account: Account, currentDate: Date, currentDateIndex: number, dateIm59: Date, balances: any, retireDate: Date) {
  // don't USE any of my accounts before my retire date, only GROW them
  if (currentDate < retireDate) {
    return false;
  }

  // use brokerage before im 59, then use up my 401k, then go back to my brokerage
  let accntToUse = null;
  if (currentDate < dateIm59) {
    accntToUse = 'brokerage';
  } else if (currentDate >= dateIm59 && balances['tax'][currentDateIndex - 1] > 0) {
    accntToUse = 'tax';
  } else if (currentDate >= dateIm59 && balances['tax'][currentDateIndex - 1] <= 0) {
    accntToUse = 'brokerage';
  }

  return account.name === accntToUse;
}

export function generateTable(balances: any, events: Event[], budgets: Budget[], absoluteMonthlyGrowth: number, myaccounts: Account[], startDate: Date, endDate: Date, dateIm59: Date, retireDate: Date, minEnd: number) {
  var tmpChartData: any = {
    labels: [],
    datasets: [
      {
        label: "brokerage",
        data: [],
        borderColor: "rgba(37,113,207,1)"
      },
      {
        label: "tax",
        data: [],
        borderColor: "rgba(0,125,76,1)"
      },
      {
        label: "",
        data: [],
        borderColor: "rgba(0,0,0,1)"
      }
    ]
  };

  // create a list of dates incrementing by 1 month
  const dates = dateRange(startDate, endDate);
  let data = dates.map((date, i) => {
    let eventDesc = "";
    let accntUsed = "";

    if (i > 0) {
      // for each account, compute their currentDay balance, then return the entry to put it in the table
      for (const account of myaccounts) {

        // USE or GROW the account?
        if (use(account, date, i, dateIm59, balances, retireDate)) {
          accntUsed = account.name;
          const budget = getCurrentBudget(date, budgets)!;
          const afterSpending = balances[account.name][i - 1] - budget.getTypeSum(CategoryTypes.Expense);
          balances[account.name][i] = afterSpending + absoluteMonthlyGrowth * afterSpending + budget.getTypeSum(CategoryTypes.Income)
        } else {
          balances[account.name][i] = balances[account.name][i - 1] + absoluteMonthlyGrowth * balances[account.name][i - 1];
          if (balances[account.name][i - 1] <= 0.0) {
            balances[account.name][i] = 0.0;
          }
        }

        // Apply Events regardless if im using the account or not
        for (const event of events) {
          // if the event is to be debited from the account, and it occurs this month/year then account for it
          if (event.account === account.name) {
            if (event.date.getMonth() === date.getMonth() && event.date.getFullYear() === date.getFullYear()) {
              eventDesc += event.name;
              if (event.category) {
                if (event.category!.type === CategoryTypes.Expense) {
                  balances[account.name][i] -= event.category!.getValue();
                }
                if (event.category!.type === CategoryTypes.Income) {
                  balances[account.name][i] += event.category!.getValue();
                }
              }
              if (event.name !== "") eventDesc += ' -- ';
            }
          }
        }
      }
    }

    tmpChartData.labels.push(`${date.getMonth() + 1}/${date.getFullYear()}`);
    tmpChartData.datasets[0].data.push(balances['brokerage'][i].toFixed(2));
    tmpChartData.datasets[1].data.push(balances['tax'][i].toFixed(2));
    tmpChartData.datasets[2].data.push(minEnd);

    const r: RowData = {
      date: `${date.getMonth() + 1}/${date.getFullYear()}`,
      brokerageBal: `$${balances['brokerage'][i].toFixed(2)}`,
      taxBal: `$${balances['tax'][i].toFixed(2)}`,
      note: eventDesc,
      accountUsed: accntUsed
    };

    return r;

  });

  return [data, tmpChartData];
}


export async function fetchStartingBalances(componentState: any) {
  const finnhub = require('finnhub');

  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  delete finnhub.ApiClient.instance.defaultHeaders['User-Agent'];

  api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
  const finnhubClient = new finnhub.DefaultApi()

  const holdingsMap = [
    {
      ticket: "VOO",
      quantity: 212.261,
      account: "brokerage"
    },
    {
      ticket: "VTI",
      quantity: 373.287,
      account: "brokerage"
    },
    {
      ticket: "ABNB",
      quantity: 3,
      account: "brokerage"
    },
    {
      ticket: "AMC",
      quantity: 1,
      account: "brokerage"
    },
    {
      ticket: "AAL",
      quantity: 1,
      account: "brokerage"
    },
    {
      ticket: "DAL",
      quantity: 5,
      account: "brokerage"
    },
    {
      ticket: "PLTR",
      quantity: 1,
      account: "brokerage"
    },
    {
      ticket: "UBER",
      quantity: 1,
      account: "brokerage"
    },

    {
      ticket: null,
      quantity: 3.08,
      account: "brokerage"
    },
    {
      ticket: "VTI",
      quantity: 36.899,
      account: "brokerage"
    },
    {
      ticket: "DAL",
      quantity: 5,
      account: "brokerage"
    },


    {
      ticket: "VTI",
      quantity: 46.430,
      account: "brokerage"
    },
    {
      ticket: "DAL",
      quantity: 3,
      account: "brokerage"
    },



    {
      ticket: "AMZN",
      quantity: 1,
      account: "brokerage"
    },
    {
      ticket: null,// ticket: "FXAIX",
      quantity: 200.05,
      account: "brokerage"
    },
    {
      ticket: null,
      quantity: 75,
      account: "brokerage"
    },

    {
      ticket: "BTC",
      isCurrency: true,
      quantity: 0.01869915,
      account: "brokerage"
    },
    {
      ticket: "ETH",
      isCurrency: true,
      quantity: 0.69812985,
      account: "brokerage"
    },

    {
      ticket: null,
      quantity: 16362.42,
      account: "tax"
    },

  ]
  for (const entry of holdingsMap) {
    if (entry.ticket !== null) {
      if (entry.isCurrency) {
        finnhubClient.cryptoCandles(`BINANCE:${entry.ticket}USDT`, "D", Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60, Math.floor(Date.now() / 1000), (error: any, data: any, response: any) => {
          if (data && data.c && data.c.length >= 2) {
            const value: number = data.c[1];
            console.log(`${entry.ticket} - ${value}`);

            const holdingValue = value * entry.quantity;
            const newBrokCurr = entry.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + holdingValue : componentState.state.balances['brokerage'][0];
            const currTaxCurr = entry.account === 'tax' ? componentState.state.balances['tax'][0] + holdingValue : componentState.state.balances['tax'][0];
            componentState.setState({
              balances: {
                brokerage: {
                  [0]: newBrokCurr,

                },
                tax: {
                  [0]: currTaxCurr,
                }
              }
            })
          }
        });
      } else {
        finnhubClient.quote(entry.ticket, (error: any, data: any, response: any) => {
          if (data && data.c) {
            const value: number = data.c;
            console.log(`${entry.ticket} - ${value}`);

            const holdingValue = value * entry.quantity;
            const newBrok = entry.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + holdingValue : componentState.state.balances['brokerage'][0];
            const currTax = entry.account === 'tax' ? componentState.state.balances['tax'][0] + holdingValue : componentState.state.balances['tax'][0];
            componentState.setState({
              balances: {
                brokerage: {
                  [0]: newBrok,

                },
                tax: {
                  [0]: currTax,
                }
              }
            })
          }
        });
      }
    } else {

      const newBrokNonStock = entry.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + entry.quantity : componentState.state.balances['brokerage'][0];
      const currTaxNonStock = entry.account === 'tax' ? componentState.state.balances['tax'][0] + entry.quantity : componentState.state.balances['tax'][0];

      console.log(`${entry.ticket} - ${newBrokNonStock}`);
      console.log(`${entry.ticket} - ${newBrokNonStock}`);


      componentState.setState({
        balances: {
          brokerage: {
            [0]: newBrokNonStock,

          },
          tax: {
            [0]: currTaxNonStock,
          }
        }
      })
    }

  }

}


export async function fetchEvents(componentState: any) {
  const finnhub = require('finnhub');
  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
  const finnhubClient = new finnhub.DefaultApi()
  const rep = componentState;
  finnhubClient.quote("AMZN", async (error: any, data: any, response: any) => {
    if (data && data.c) {
      const currentAmazonStockPrice: number = data.c;
      let fetchedEvents: Event[] = [];
      try {
        const response = (await API.graphql({
          query: listEvents
        })) as { data: ListEventsQuery }
        for (const event of response.data.listEvents!.items!) {
          let value = 0.0;
          let name = event!.name!;
          if (event!.category && event?.category.value) {
            value = event?.category!.value!;
          }
          if (event?.name && event?.name?.includes('amzn')) {
            const parts = event.name.split(' ');
            const quantity = Number(parts[1]);
            name = `earn ${quantity} x amzn stock ${currentAmazonStockPrice}`;
            value = Number((quantity * currentAmazonStockPrice - (0.3 * quantity * currentAmazonStockPrice)).toFixed(2));
          }
          const cc = event?.category ? new Category(event.category!.id!, event!.category!.name!, value, event!.category!.type!) : null;
          const e = new Event(event!.id!, name, new Date(event!.date!), event!.account!, cc);
          e.printEvent();
          fetchedEvents.push(e);
        }
        rep.setState({ events: fetchedEvents })
      } catch (error) {
        console.log(error);
      }
    }
  });


}

export async function fetchAccounts(componentState: any) {
  let fetchedAccounts: Account[] = [];
  try {
    const response = (await API.graphql({
      query: listAccounts
    })) as { data: ListAccountsQuery }
    for (const account of response.data.listAccounts!.items!) {
      fetchedAccounts.push(new Account(account!.id!, account!.name!));
    }
    componentState.setState({ accounts: fetchedAccounts })
  } catch (error) {
    console.log(error);
  }
}

export async function fetchBudgets(componentState: any) {
  let fetchedBudgets: Budget[] = [];
  try {
    const response = (await API.graphql({
      query: listBudgets
    })) as { data: ListBudgetsQuery }
    for (const budget of response.data.listBudgets!.items!) {
      let cats = null;

      if (budget?.categories) {
        cats = [];
        for (const category of budget!.categories!) {
          cats.push(new Category('', category!.name!, category!.value!, (category!.type!.toString() === "Expense" ? CategoryTypes.Expense : CategoryTypes.Income)));
        }
      }
      fetchedBudgets.push(new Budget(budget!.id!, budget!.name!, new Date(budget!.startDate!), new Date(budget!.endDate!), cats));
    }
    componentState.setState({ budgets: fetchedBudgets })
  } catch (error) {
    console.log(error);
  }
}

export async function fetchInputs(componentState: any) {
  let fetchedInputs: any[] = [];
  let growth = 0.0;
  let inflation = 0.0;
  try {
    const response = (await API.graphql({
      query: listInputs
    })) as { data: ListInputsQuery }
    for (const input of response.data.listInputs!.items!) {

      if (input?.type === 'date') {
        fetchedInputs.push({
          id: input?.id,
          key: input?.key!,
          type: input?.type!,
          value: new Date(input?.value!)
        });
      } else if (input?.type === "number") {

        fetchedInputs.push({
          id: input?.id,
          key: input?.key!,
          type: input?.type!,
          value: Number(input?.value!)
        });
      }

      if (input?.key === 'growth') {
        growth = Number(input?.value!);
      }
      if (input?.key === 'inflation') {
        inflation = Number(input?.value!);
      }
    }

    // add computed inputs
    fetchedInputs.push({
      id: new Date().getTime().toString(),
      key: "absoluteMonthlyGrowth",
      type: "computed-number",
      value: (growth - inflation) / 12 / 100
    });

    fetchedInputs.push({
      id: new Date().getTime().toString(),
      key: "startDate",
      type: "computed-date",
      value: new Date()
    });

    componentState.setState({ inputs: fetchedInputs } as any);
    for (const i of fetchedInputs) {
      componentState.setState({ [i.key]: i.value } as any);
    }

  } catch (error) {
    console.log(error);
  }
}