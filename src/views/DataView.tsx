import * as React from 'react';

import { Event } from '../model/Base/Event';
import { Budget } from '../model/Base/Budget';
import { Account } from '../model/Base/Account';
import {
    RowData,
    generateData
} from '../utilities/helpers';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AccountDataAccess } from '../utilities/AccountDataAccess';
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';

import '../App.css';
import { InputDataAccess } from '../utilities/InputDataAccess';
import { EventDataAccess } from '../utilities/EventDataAccess';
import { AssetDataAccess } from '../utilities/AssetDataAccess';
import { getFinnhubClient } from '../utilities/helpers';

interface DataViewProps {
    value: number;
    index: number;
}

interface IState {
    events: Event[];
    budgets: Budget[];
    growth: number | null;
    inflation: number | null;
    absoluteMonthlyGrowth: number | null;
    startDate: Date | null;
    endDate: Date | null;
    dateIm59: Date | null;
    minEnd: number | null;
    retireDate: Date | null;
    accounts: Account[];
    balances: any;
    balanceData: any | null;
    finnhubClient: any;
}

class DataView extends React.Component<DataViewProps, IState> {

    constructor(props: DataViewProps) {

        super(props);
        const finnhubClient = getFinnhubClient();
    
        this.state = {
            growth: null,
            inflation: null,
            absoluteMonthlyGrowth: null,
            startDate: null,
            endDate: null,
            dateIm59: null,
            retireDate: null,
            minEnd: null,
            events: [],
            budgets: [],
            accounts: [],
            balances: {},
            balanceData: null,
            finnhubClient: finnhubClient
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }
    async getData() {
        const simulations = await SimulationDataAccess.fetchSimulations(this);
        await BudgetDataAccess.fetchBudgets(this, simulations);
        await EventDataAccess.fetchEvents(this, simulations,this.state.finnhubClient);
        await InputDataAccess.fetchInputs(this, simulations);
        await AccountDataAccess.fetchAccounts(this);
        await AssetDataAccess.fetchStartingBalances(this,this.state.finnhubClient);
        const balanceData = generateData(this.state.balances, this.state.events, this.state.budgets, this.state.absoluteMonthlyGrowth!,
            this.state.accounts, this.state.startDate!, this.state.endDate!, this.state.dateIm59!, this.state.retireDate!, this.state.minEnd!);

        this.setState({ balanceData: balanceData });

    }

    render() {
        if (this.state.balanceData) {
            return this.props.index === this.props.value ? (
                <>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="center">Brokerage</TableCell>
                                    <TableCell align="center">Tax</TableCell>
                                    <TableCell align="center">Sum</TableCell>
                                    <TableCell align="center">Return</TableCell>
                                    <TableCell align="left">Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.balanceData.map((row: RowData) => (
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
                                        <TableCell align="center">{row.sum}</TableCell>
                                        <TableCell align="center">{row.return}%</TableCell>
                                        <TableCell align="left">{row.note}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (<></>);
        } else {
            return (<></>);
        }
    }
}

export default DataView;
