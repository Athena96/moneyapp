import * as React from 'react';

import Amplify from 'aws-amplify'
import awsExports from "../../aws-exports";
import { Simulation } from '../../model/Base/Simulation';
import Box from '@mui/material/Box';

import { Budget } from '../../model/Base/Budget';
import { Link } from "react-router-dom";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import { BudgetDataAccess } from '../../utilities/BudgetDataAccess';
import { EventDataAccess } from '../../utilities/EventDataAccess';
import { Category } from '../../model/Base/Category';
import { Event } from '../../model/Base/Event';

import { CategoryTypes } from '../../API';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Dialog from '@mui/material/Dialog';
import BudgetDialogView from './BudgetsDialogView';
import EventDialogView from './EventDialogView';

Amplify.configure(awsExports);

interface BudgetsEventsViewProps {
    user: string;
    simulation: Simulation | undefined;
    type: CategoryTypes;
}

interface BudgetsEventsViewState {
    budgets: Budget[],
    events: Event[],
    recurringDialogOpen: boolean,
    oneTimeDialogOpen: boolean,
    budgetToEdit: Budget | undefined,
    eventToEdit: Event | undefined
}

class BudgetsEventsView extends React.Component<BudgetsEventsViewProps, BudgetsEventsViewState> {

    constructor(props: BudgetsEventsViewProps) {

        super(props);

        this.state = {
            budgets: [],
            events: [],
            recurringDialogOpen: false,
            oneTimeDialogOpen: false,
            budgetToEdit: undefined,
            eventToEdit: undefined
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
        this.editRecurring = this.editRecurring.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    async componentDidMount() {
        if (this.props.simulation) {
            const budgets = await BudgetDataAccess.fetchBudgetsForSelectedSim(this.props.simulation.getKey());
            const events = await EventDataAccess.fetchEventsForSelectedSim(this.props.simulation.getKey());
            this.setState({budgets, events});
        }
    }

    async handleAddBudget(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const newBudget: any = new Budget(new Date().getTime().toString(), '...', 0, 0, 
            [new Category('1', '...', 0.0)], this.props.type, this.props.simulation!.id!);
        console.log(JSON.stringify(newBudget))
        const newBudgets = [...this.state.budgets, newBudget]
        this.setState({ budgets: newBudgets });
        await BudgetDataAccess.createBudget(newBudget);
    }

    getAvgMonthlyBudgets(budgets: Budget[]) {
        if (budgets.length === 0) return "0.00"
        // not weighted avg
        let count = budgets.map((budget: Budget) => {
            return budget.type === this.props.type ? 1 : 0
        }).reduce((p: number, c: number) => p + c, 0);

        let sum = budgets.map((budget: Budget) => {
            return budget.type === this.props.type ? budget.getSum() : 0.0
        }).reduce((p: number, c: number) => p + c, 0);
        return isNaN(sum / count) ? "0.00" : (sum / count).toFixed(2);
    }

    getEventsTotal(events: Event[]) {

        let sum = events.map((event: Event) => {
            return event.type === this.props.type ? event.category?.value || 0 : 0.0
        }).reduce((p: number, c: number) => p + c, 0);
        return (sum).toFixed(2);
    }

    editRecurring(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, budgetToEdit: Budget) {
        this.setState({ recurringDialogOpen: true, budgetToEdit: budgetToEdit });
    }

    editOneTimeEvent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, eventToEdit: Event) {
        this.setState({ oneTimeDialogOpen: true, eventToEdit: eventToEdit });
    }


    closeDialog() {
        this.setState({ recurringDialogOpen: false, oneTimeDialogOpen: false });
    }


    async handleAddEvent() {
        const newEvent = new Event(new Date().getTime().toString(), '...', 0, 
        new Category('1', '...', 0.0), this.props.type, this.props.simulation!.id!);
        const newEvents = [...this.state.events, newEvent]
        this.setState({ events: newEvents });
        await EventDataAccess.createEvent(newEvent);
    }

    async deleteRecurringBudget(budget: Budget) {
        const idToDelete = budget.id;
        if (window.confirm(`Are you sure you want to DELETE this Recurring ${this.props.type}?`)) {
            let newBudgets = [];
            let budegetIdToDelete = null;

            for (const budget of this.state.budgets) {
                if (budget.getKey() === idToDelete) {
                    budegetIdToDelete = budget.getKey()
                    continue;
                }
                newBudgets.push(budget);
            }
            this.setState({ budgets: newBudgets });
            await BudgetDataAccess.deleteBudget(budegetIdToDelete!)
        }
    }

    async deleteOneTimeEvent(event: Event) {
        const idToDelete = event.id;
        if (window.confirm(`Are you sure you want to DELETE this One Time ${this.props.type}?`)) {
            let newEvents = [];
            let eventIdToDelete = null;

            for (const event of this.state.events) {
                if (event.getKey() === idToDelete) {
                    eventIdToDelete = event.getKey()
                    continue;
                }
                newEvents.push(event);
            }
            this.setState({ events: newEvents });
            await EventDataAccess.deleteEvent(eventIdToDelete!)
        }
    }


    render() {
        if (this.props.simulation && this.state.budgets) {
            return (
                <Box>
                    <Dialog open={this.state.recurringDialogOpen} onClose={this.closeDialog}>
                        {this.state.budgetToEdit && <BudgetDialogView user={this.props.user} simulation={this.props.simulation} budget={this.state.budgetToEdit!} type={this.props.type} closeDialog={this.closeDialog} />}
                    </Dialog>

                    <Dialog open={this.state.oneTimeDialogOpen} onClose={this.closeDialog}>
                        {this.state.eventToEdit && <EventDialogView user={this.props.user} simulation={this.props.simulation} event={this.state.eventToEdit!} type={this.props.type} closeDialog={this.closeDialog} />}
                    </Dialog>

                    <Box>
                        <h1>{this.props.type}s</h1>
                        <br />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography><b>Recurring {this.props.type}</b><br />${this.getAvgMonthlyBudgets(this.state.budgets)} / month</Typography>


                            </AccordionSummary>
                            <AccordionDetails>
                                {this.state.budgets.sort((a, b) => (a.startAge > b.startAge) ? 1 : -1).map((budget: Budget, i: number) => {
                                    if (budget.type === this.props.type) {
                                        return (
                                            <>
                                                <Card variant="outlined" >
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Typography ><b>{budget.name}</b></Typography>
                                                                <Typography>{budget.startAge} - {budget.endAge}</Typography>
                                                                <Button onClick={(e) => this.editRecurring(e, budget)}><EditIcon /></Button>
                                                                <Button onClick={(e) => this.deleteRecurringBudget(budget)}><DeleteIcon /></Button>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Typography ><b>${(budget.getSum()).toFixed(2)} / mo</b></Typography>
                                                                <Typography ><b>${(budget.getSum() * 12).toFixed(2)} / yr</b></Typography>

                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                                <br />
                                            </>
                                        )
                                    } else {
                                        return (<></>)
                                    }
                                })}
                                <Button style={{ width: "100%" }} key={'add'} onClick={(e) => this.handleAddBudget(e)} variant="outlined">add recurring {this.props.type} <AddCircleIcon /></Button>
                            </AccordionDetails>

                        </Accordion>


                        <br />
                        <br />


                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography><b>One-time {this.props.type}</b><br />${this.getEventsTotal(this.state.events)} total</Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                {this.state.events.sort((a, b) => (a.age > b.age) ? 1 : -1).map((event: Event, i: number) => {
                                    if (event.type === this.props.type) {
                                        return (
                                            <>
                                                <Card variant="outlined" >
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Typography ><b>{event.name}</b></Typography>
                                                                <Button onClick={(e) => this.editOneTimeEvent(e, event)}><EditIcon /></Button>
                                                                <Button onClick={(e) => this.deleteOneTimeEvent(event)}><DeleteIcon /></Button>
                                                            </Grid>

                                                            <Grid item xs={4}>

                                                                <Typography ><b>${event.category?.value.toFixed(2) || 0.0}</b></Typography>
                                                                <Typography>{event.age}</Typography>

                                                            </Grid>

                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                                <br />
                                            </>
                                        )
                                    } else {
                                        return (<></>)
                                    }

                                })}
                                <Button style={{ width: "100%" }} key={'add'} onClick={(e) => this.handleAddEvent()} variant="outlined">add one-time {this.props.type} <AddCircleIcon /></Button>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
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

export default BudgetsEventsView;
