import * as React from 'react';
import {
    MonteCarloRowData
} from '../utilities/helpers';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';

import '../App.css';
import { Simulation } from '../model/Base/Simulation';

interface DataViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
    balanceData: MonteCarloRowData[] | null;
}

class DataView extends React.Component<DataViewProps, IState> {

    constructor(props: DataViewProps) {
        super(props);
        this.state = {
            balanceData: null
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        if (this.props.simulation) {
            this.setState({ balanceData: this.props.simulation.getSimulationData() });
        }
    }

    render() {

        if (this.state.balanceData && this.props.simulation) {
            return (<Box>
                <h1 >Data</h1>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">Brokerage Balance</TableCell>
                                <TableCell align="center">Tax Balance</TableCell>
                                <TableCell align="center">Total Balance</TableCell>
                                <TableCell align="center">Income/Expense</TableCell>
                                <TableCell align="center">Account Withdrawn From</TableCell>
                                {/* <TableCell align="center">Tax</TableCell>
                                        <TableCell align="center">Sum</TableCell> */}
                                <TableCell align="center">Return</TableCell>
                                <TableCell align="left">Events</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.balanceData.map((row: MonteCarloRowData) => (
                                <TableRow
                                    style={{ backgroundColor: (row.accountUsed === 'brokerage' ? 'lightblue' : row.accountUsed === 'tax' ? 'lightgreen' : 'white') }}
                                    key={row.date}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.date}
                                    </TableCell>

                                    <TableCell align="center">{row.assumedAvgBalanceBrok}</TableCell>
                                    <TableCell align="center">{row.assumedAvgBalanceTax}</TableCell>

                                    <TableCell align="center">{row.avgBalance}</TableCell>
                                    <TableCell align="center">${Number(row.incomeExpenses).toFixed(2)}</TableCell>
                                    <TableCell align="center">{row.accountUsed}</TableCell>
                                    {/* <TableCell align="center">{row.taxBal}</TableCell>
                                            <TableCell align="center">{row.sum}</TableCell> */}
                                    <TableCell align="center">{row.return}%</TableCell>
                                    <TableCell align="left">{row.events?.map((e) => {
                                        const pm = e.type!.toString() === 'Expense' ? '-' : '+';
                                        return <Link to={`/event/${e.getKey()}`}>{e.name === "" || e.name === "..." ? `${pm}$${e.category!.value} | ` : `${e.name} ${pm}$${e.category!.value} | `}</Link>
                                    })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            )
        } else {
            return (
                <div style={{ textAlign: 'center' }}>
                    <p>Please create a <b>Simulation</b> first. <br />Click <Link to="/scenarios">here</Link> to create one!</p>
                </div>
            )
        }
    }
}

export default DataView;
