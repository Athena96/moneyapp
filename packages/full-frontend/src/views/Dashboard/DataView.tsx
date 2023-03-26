import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';

import '../../App.css';
import { Simulation } from '../../model/Base/Simulation';
import { Event } from '../../model/Base/Event';
import { EventDataAccess } from '../../utilities/EventDataAccess';
import { InputDataAccess } from '../../utilities/InputDataAccess';
import { BudgetDataAccess } from '../../utilities/BudgetDataAccess';
import { getRecurringContribWithdrawlTimeline, getOneTimeContribWithdrawlTimeline } from '../../utilities/helpers';
interface DataViewProps {
    user: string;
    simulation: Simulation | undefined;
    balanceData: number[]
}

interface IState {
    eventsMap: Map<number, Event[]>;
    budgetsMap: Map<number, number>;
    oneTimeMap: Map<number, number>;
    startAge: number;
}

class DataView extends React.Component<DataViewProps, IState> {

    constructor(props: DataViewProps) {
        super(props);
        this.state = {
            eventsMap: new Map(),
            budgetsMap: new Map(),
            oneTimeMap: new Map(),
            startAge: 0
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
    }

    async componentDidMount() {

        // get Budgets and Events
        // create year by year contrib/withdrawl of recurring and one time contrib/withdrawl
        // add in table

        const simId = this.props.simulation!.getKey();
        const events = await EventDataAccess.fetchEventsForSelectedSim(simId);
        const budgets = await BudgetDataAccess.fetchBudgetsForSelectedSim(simId);
        const defaultInputs = await InputDataAccess.fetchInputsForSelectedSim(simId);
        const startAge = defaultInputs.age
        console.log(budgets)

        // build events map
        const eventsMap = new Map<number, Event[]>()
        for (const event of events) {
            if (!eventsMap.has(event.age)) {
                eventsMap.set(event.age, [])
            }
            eventsMap.get(event.age)!.push(event)
        }


        const budgetsMap = getRecurringContribWithdrawlTimeline(startAge, budgets);
        console.log(budgetsMap)
        const oneTimeMap = getOneTimeContribWithdrawlTimeline(startAge, events);

        this.setState({ eventsMap, startAge, budgetsMap, oneTimeMap });
    }

    render() {

        if (this.props.simulation) {
            return (<Box>
                <h1 >Data</h1>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Age</TableCell>
                                <TableCell align="center">Balance</TableCell>
                                <TableCell align="center">Recurring +/-</TableCell>
                                <TableCell align="center">One Time +/-</TableCell>
                                <TableCell align="left">Events</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.balanceData.map((row: number, i: number) => {
                                const currentAge = i + this.state.startAge
                                const eventsAtRow = this.state.eventsMap.get(currentAge) || []
                                const recurringContribWithdrawl = this.state.budgetsMap.get(currentAge) || 0.0
                                const oneTimeContribWithdrawl = this.state.oneTimeMap.get(currentAge) || 0.0
                                return (
                                    <TableRow
                                        style={{ backgroundColor: 'white' }}
                                        key={`${i + this.state.startAge}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {`${i + this.state.startAge}`}
                                        </TableCell>

                                        <TableCell align="center">${Number(row).toFixed(2)}</TableCell>
                                        <TableCell align="center">${recurringContribWithdrawl.toFixed(2)} (/month ${(recurringContribWithdrawl/12.0).toFixed(2)})</TableCell>
                                        <TableCell align="center">${oneTimeContribWithdrawl.toFixed(2)}</TableCell>

                                        {/* <TableCell align="center">{row.taxBal}</TableCell>
                                                <TableCell align="center">{row.sum}</TableCell> */}
                                        <TableCell align="left">{eventsAtRow.map((e) => {
                                            const pm = e.type!.toString() === 'Expense' ? '-' : '+';
                                            return <Link to={`/event/${e.getKey()}`}>{e.name === "" || e.name === "..." ? `${pm}$${e.category!.value} | ` : `${e.name} ${pm}$${e.category!.value} | `}</Link>
                                        })}</TableCell>
                                    </TableRow>
                                )
                            })}
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
