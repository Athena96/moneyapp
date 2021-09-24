import * as React from 'react';

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import { getEvents, getBudgets, getAccounts } from '../utilities/dataSetup';
import { generateTable, RowData } from '../utilities/helpers';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import '../App.css';

interface DataViewProps {
    value: number;
    index: number;
}

interface IState {
    today: Date;
    events: Event[];
    budgets: Budget[];
    growth: number;
    inflation: number;
    absoluteMonthlyGrowth: number;
    startDate: Date;
    endDate: Date;
    dateIm59: Date;
    retireDate: Date;
    accounts: Account[];
    balances: any;
}

class DataView extends React.Component<DataViewProps, IState> {

    constructor(props: DataViewProps) {

        super(props);
        let n = new Date();

        this.state = {
            today: n,
            events: [],
            budgets: getBudgets(),
            growth: 10.49,
            inflation: 2.75,
            absoluteMonthlyGrowth: ((10.49 - 2.75) / 100) / 12,
            startDate: n,
            endDate: new Date('12/31/2096'),
            dateIm59: new Date('4/25/2055'),
            retireDate: new Date('1/29/2024'),
            accounts: getAccounts(),
            balances: {
                brokerage: {
                    [0]: 199160.56,

                },
                tax: {
                    [0]: 16362.42,
                }
            }
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchEventData = this.fetchEventData.bind(this);

        this.render = this.render.bind(this);
    }

    componentDidMount() {
        this.fetchEventData();
    }

    async fetchEventData() {
        const finnhub = require('finnhub');

        const api_key = finnhub.ApiClient.instance.authentications['api_key'];
        api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
        const finnhubClient = new finnhub.DefaultApi()


        finnhubClient.quote("AMZN", (error: any, data: any, response: any) => {
            const currentAmazonStockPrice: number = data.c;
            this.setState({ events: getEvents(currentAmazonStockPrice) })
        });



    }

    render() {

        const [balanceData, chartData] = generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth,
            this.state.accounts, this.state.startDate, this.state.endDate, this.state.dateIm59, this.state.retireDate);
        return this.props.index === this.props.value ? (
            <div >


                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">Brokerage</TableCell>
                                <TableCell align="center">Tax</TableCell>
                                <TableCell align="left">Note</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {balanceData.map((row: RowData) => (
                                <TableRow
                                    style={{ backgroundColor: (row.accountUsed === 'brokerage' ? 'lightblue' : row.accountUsed === 'tax' ? 'lightgreen' : 'white') }}
                                    key={row.date}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.date}
                                    </TableCell>
                                    <TableCell align="center">{row.brokerageBal}</TableCell>
                                    <TableCell align="center">{row.taxBal}</TableCell>
                                    <TableCell align="left">{row.note}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        ) : (<></>);
    }
}

export default DataView;
