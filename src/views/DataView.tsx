import * as React from 'react';

import '../App.css';
import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import { getEvents, getBudgets } from '../utilities/dataSetup';
import { generateTable, RowData } from '../utilities/helpers';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
        let brokerage = new Account('brokerage');
        let tax = new Account('tax');
        let theaccounts: Account[] = [];
        theaccounts.push(brokerage);
        theaccounts.push(tax);

        this.state = {
            today: n,
            events: getEvents(),
            budgets: getBudgets(),
            growth: 10.49,
            inflation: 2.75,
            absoluteMonthlyGrowth: ((10.49 - 2.75) / 100) / 12,
            startDate: n,
            endDate: new Date('12/31/2096'),
            dateIm59: new Date('4/25/2055'),
            retireDate: new Date('1/29/2024'),
            accounts: theaccounts,
            balances: {
                brokerage: {
                    [0]: 199160.56,

                },
                tax: {
                    [0]: 16362.42,
                }
            }
        }

        this.render = this.render.bind(this);
    }

    render() {

        const [balanceData, chartData] = generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth,
            this.state.accounts, this.state.startDate, this.state.endDate, this.state.dateIm59, this.state.retireDate);
        return this.props.index === this.props.value ? (
            <div >


                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">Brokerage</TableCell>
                                <TableCell align="center">Tax</TableCell>
                                <TableCell align="left">Note</TableCell>
                                <TableCell align="center">Accnt Used</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {balanceData.map((row: RowData) => (
                                <TableRow
                                    key={row.date}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.date}
                                    </TableCell>
                                    <TableCell align="center">{row.brokerageBal}</TableCell>
                                    <TableCell align="center">{row.taxBal}</TableCell>
                                    <TableCell align="left">{row.note}</TableCell>
                                    <TableCell align="center">{row.accountUsed}</TableCell>
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
