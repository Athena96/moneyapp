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

import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { Auth } from 'aws-amplify';


import '../App.css';

interface DataViewProps {
    value: number;
    index: number;
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
        const user = await Auth.currentAuthenticatedUser();
        const email: string = user.attributes.email;
        const simulation = await SimulationDataAccess.fetchSelectedSimulationForUser(this, email);
        this.setState({ balanceData: simulation.getSimulationData() });
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
                                    <TableCell align="center">Total Balance</TableCell>
                                    {/* <TableCell align="center">Tax</TableCell>
                                    <TableCell align="center">Sum</TableCell> */}
                                    <TableCell align="center">Return</TableCell>
                                    <TableCell align="left">Note</TableCell>
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
                                        <TableCell align="center">{row.avgBalance}</TableCell>
                                        {/* <TableCell align="center">{row.taxBal}</TableCell>
                                        <TableCell align="center">{row.sum}</TableCell> */}
                                        <TableCell align="center">{row.return}%</TableCell>
                                        <TableCell align="left">{row.events?.map((e) => {
                                            const pm = e.category?.type!.toString() === 'Expense' ? '-' : '+';
                                            return  <Link to={`/events/${e.getKey()}`}>{e.name === "" || e.name === "..." ? `${pm}$${e.category!.value}` + ' | ' : `${e.name} ${pm}$${e.category!.value}` + ' | '}</Link>
                                        })}</TableCell>
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
