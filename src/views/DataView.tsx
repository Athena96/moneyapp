import * as React from 'react';

import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import { getBudgets, getAccounts, getInputs } from '../utilities/dataSetup';
import { generateTable, RowData, fetchStartingBalances, fetchEventData } from '../utilities/helpers';

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
    events: Event[];
    budgets: Budget[];
    growth: number;
    inflation: number;
    absoluteMonthlyGrowth: number;
    startDate: Date;
    endDate: Date;
    dateIm59: Date;
    retireDate: Date;
    minEnd: number;
    accounts: Account[];
    balances: any;
}

class DataView extends React.Component<DataViewProps, IState> {

    constructor(props: DataViewProps) {

        super(props);
        const inputs = getInputs();

        this.state = {
            growth: inputs.growth,
            inflation: inputs.inflation,
            absoluteMonthlyGrowth: inputs.absoluteMonthlyGrowth,
            startDate: inputs.startDate,
            endDate: inputs.endDate,
            dateIm59: inputs.dateIm59,
            retireDate: inputs.retireDate,
            minEnd: inputs.minEnd,

            events: [],
            budgets: getBudgets(),
            accounts: getAccounts(),
            balances: {
                brokerage: {
                    [0]: 0,

                },
                tax: {
                    [0]: 0,
                }
            }
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
    }

    componentDidMount() {
        fetchStartingBalances(this);
        fetchEventData(this);
    }

    render() {

        const [balanceData, chartData] = generateTable(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth,
            this.state.accounts, this.state.startDate, this.state.endDate, this.state.dateIm59, this.state.retireDate, this.state.minEnd);
        return this.props.index === this.props.value ? (
            <>
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
</>
        ) : (<></>);
    }
}

export default DataView;
