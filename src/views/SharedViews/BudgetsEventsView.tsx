import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createBudget, createEvent, deleteBudget, deleteEvent } from '../../graphql/mutations'
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
import { Account } from '../../model/Base/Account';
import { Category } from '../../model/Base/Category';
import { Event } from '../../model/Base/Event';

import { AccountDataAccess } from '../../utilities/AccountDataAccess';
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
    accounts: Account[],
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
            accounts: [],
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
            await BudgetDataAccess.fetchBudgetsForSelectedSim(this, this.props.simulation.getKey());
            await EventDataAccess.fetchEventsForSelectedSim(this, this.props.simulation.getKey());
            await AccountDataAccess.fetchAccountsForUserSelectedSim(this, this.props.simulation.getKey());
        }
    }

    async handleAddBudget(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        try {
            let newBudget: any = new Budget(new Date().getTime().toString(), '...', new Date(), new Date(), [new Category('1', '...', 0.0)], this.props.type);

            newBudget['simulation'] = this.props.simulation!.id;
            let formatedBudget = BudgetDataAccess.convertToDDBObject(newBudget, this.props.simulation!.id);
            let newBudgets = [...this.state.budgets, formatedBudget]
            this.setState({ budgets: newBudgets });
            await API.graphql(graphqlOperation(createBudget, { input: formatedBudget }))
        } catch (err) {
            console.log('error creating todo:', err)
        }
    }


    pretyDate(date: Date) {
        return `${date.getMonth() + 1}/${date.getFullYear()}`
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
        return (sum / count).toFixed(2);
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
        try {
            let newEvent: any = new Event(new Date().getTime().toString(), '...', new Date(), this.state.accounts[0].name, new Category('1', '...', 0.0), this.props.type);
            newEvent['simulation'] = this.props.simulation!.id;
            let formatedEvent = EventDataAccess.convertToDDBObject(newEvent, this.props.simulation!.id);
            let newEvents = [...this.state.events, formatedEvent]
            this.setState({ events: newEvents });
            await API.graphql(graphqlOperation(createEvent, { input: formatedEvent }))
        } catch (err) {
            console.log('error creating todo:', err)
        }
    }

    async deleteRecurringBudget(budget: Budget) {
        const idToDelete = budget.id;
        if (window.confirm(`Are you sure you want to DELETE this Recurring ${this.props.type}?`)) {
            let newBudgets = [];
            let budgetToDelete = null;

            for (const budget of this.state.budgets) {
                if (budget.getKey() === idToDelete) {
                    budgetToDelete = {
                        'id': budget.getKey()
                    }
                    continue;
                }
                newBudgets.push(budget);
            }
            this.setState({ budgets: newBudgets });
            try {
                await API.graphql({ query: deleteBudget, variables: { input: budgetToDelete } });
            } catch (err) {
                console.log('error:', err)
            }
        }
    }

    async deleteOneTimeEvent(event: Event) {
        const idToDelete = event.id;
        if (window.confirm(`Are you sure you want to DELETE this One Time ${this.props.type}?`)) {
            let newEvents = [];
            let eventToDelete = null;

            for (const event of this.state.events) {
                if (event.getKey() === idToDelete) {
                    eventToDelete = {
                        'id': event.getKey()
                    }
                    continue;
                }
                newEvents.push(event);
            }
            this.setState({ events: newEvents });
            try {
                await API.graphql({ query: deleteEvent, variables: { input: eventToDelete } });
            } catch (err) {
                console.log('error:', err)
            }
        }
    }


    render() {
        if (this.props.simulation && this.state.budgets) {
            const title = this.props.type === CategoryTypes.Expense ? "Expenses" : "Incomes";
            return (
                <Box>
                    <Dialog open={this.state.recurringDialogOpen} onClose={this.closeDialog}>
                        {this.state.budgetToEdit && <BudgetDialogView user={this.props.user} simulation={this.props.simulation} budget={this.state.budgetToEdit!} type={this.props.type} closeDialog={this.closeDialog} />}
                    </Dialog>

                    <Dialog open={this.state.oneTimeDialogOpen} onClose={this.closeDialog}>
                        {this.state.eventToEdit && <EventDialogView user={this.props.user} simulation={this.props.simulation} event={this.state.eventToEdit!} type={this.props.type} closeDialog={this.closeDialog} />}
                    </Dialog>

                    <Box>
                        <h1>{title}</h1>
                        <br />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography><b>Recurring {title}</b><br />${this.getAvgMonthlyBudgets(this.state.budgets)} / month</Typography>


                            </AccordionSummary>
                            <AccordionDetails>
                                {this.state.budgets.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1).map((budget: Budget, i: number) => {
                                    if (budget.type === this.props.type) {
                                        return (
                                            <>
                                                <Card variant="outlined" >
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Typography ><b>{budget.name}</b></Typography>
                                                                <Typography>{this.pretyDate(budget.startDate)} - {this.pretyDate(budget.endDate)}</Typography>
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
                                <Button style={{ width: "100%" }} key={'add'} onClick={(e) => this.handleAddBudget(e)} variant="outlined">add recurring Income <AddCircleIcon /></Button>
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
                                <Typography><b>One-time {title}</b><br />${this.getEventsTotal(this.state.events)} total</Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                {this.state.events.sort((a, b) => (a.date > b.date) ? 1 : -1).map((event: Event, i: number) => {
                                    if (event.type === this.props.type) {
                                        return (
                                            <>
                                                <Card variant="outlined" >
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Typography ><b>{event.name}</b></Typography>
                                                                <Typography>to account: {event.account}</Typography>
                                                                <Button onClick={(e) => this.editOneTimeEvent(e, event)}><EditIcon /></Button>
                                                                <Button onClick={(e) => this.deleteOneTimeEvent(event)}><DeleteIcon /></Button>
                                                            </Grid>

                                                            <Grid item xs={4}>

                                                                <Typography ><b>${event.category?.value.toFixed(2) || 0.0}</b></Typography>
                                                                <Typography>{this.pretyDate(event.date)}</Typography>

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
                                <Button style={{ width: "100%" }} key={'add'} onClick={(e) => this.handleAddEvent()} variant="outlined">add one-time {title} <AddCircleIcon /></Button>
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
