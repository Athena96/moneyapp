import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createBudget, createEvent, deleteBudget, deleteEvent, updateBudget, updateEvent } from '../graphql/mutations'
import awsExports from "../aws-exports";
import { Simulation } from '../model/Base/Simulation';
import Box from '@mui/material/Box';

import { Budget } from '../model/Base/Budget';
import { Link } from "react-router-dom";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { BudgetDataAccess } from '../utilities/BudgetDataAccess';
import { BudgetFactory } from '../model/FactoryMethods/BudgetFactory';
import { getObjectWithId } from '../utilities/helpers';
// import { Category, CategoryTypes } from '../API';
import { EventDataAccess } from '../utilities/EventDataAccess';
import { Account } from '../model/Base/Account';
import { Category } from '../model/Base/Category';
import { Event } from '../model/Base/Event';

import { AccountDataAccess } from '../utilities/AccountDataAccess';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { NetworkCheckTwoTone } from '@mui/icons-material';
import { CategoryTypes } from '../API';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DateTimePickerProps } from '@mui/lab';
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
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
Amplify.configure(awsExports);

interface IncomesViewProps {
    user: string;
    simulation: Simulation | undefined;

}

interface IState {
    budgets: Budget[],
    events: Event[],
    accounts: Account[],
    recurringExpenseDialogOpen: boolean
    oneTimeExpenseDialogOpen: boolean
}

class IncomesView extends React.Component<IncomesViewProps, IState> {

    constructor(props: IncomesViewProps) {

        super(props);

        this.state = {
            budgets: [],
            events: [],
            accounts: [],
            recurringExpenseDialogOpen: false,
            oneTimeExpenseDialogOpen: false
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
        this.editRecurringExpense = this.editRecurringExpense.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    async componentDidMount() {
        if (this.props.simulation) {
            await BudgetDataAccess.fetchBudgetsForSelectedSim(this, this.props.simulation.getKey());
            await EventDataAccess.fetchEventsForSelectedSim(this, this.props.simulation.getKey());
            await AccountDataAccess.fetchAccountsForUserSelectedSim(this, this.props.simulation.getKey());
        }
    }

    async handleAddBudget(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, simulationId: string) {
        try {
            let newBudet: any = new Budget(new Date().getTime().toString(), "...", new Date(), new Date(), null, CategoryTypes.Income);
            newBudet['simulation'] = this.props.simulation!.getKey();

            let newBudgets = [...this.state.budgets, newBudet]
            this.setState({ budgets: newBudgets });
            await API.graphql(graphqlOperation(createBudget, { input: newBudet }))
        } catch (err) {
            console.log('error creating todo:', err)
        }
    }


    pretyDate(date: Date) {
        return `${date.getMonth() + 1}/${date.getFullYear()}`
    }

    getAvgMonthlyExpenses(budgets: Budget[]) {
        // not weighted avg
        let count = budgets.map((budget: Budget) => {
            return budget.type === CategoryTypes.Income ? 1 : 0
        }).reduce((p: number, c: number) => p + c, 0);

        let sum = budgets.map((budget: Budget) => {
            return budget.type === CategoryTypes.Income ? budget.getSum() : 0.0
        }).reduce((p: number, c: number) => p + c, 0);
        return (sum / count).toFixed(2);
    }


    getEventsTotal(events: Event[]) {

        let sum = events.map((event: Event) => {
            return event.type === CategoryTypes.Income ? event.category?.value || 0 : 0.0
        }).reduce((p: number, c: number) => p + c, 0);
        return (sum).toFixed(2);
    }

    handleDeleteCategory(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

    }

    editRecurringExpense(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        this.setState({ recurringExpenseDialogOpen: true });
    }

    editOneTimeExpense(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        this.setState({ oneTimeExpenseDialogOpen: true });
    }

    closeDialog() {
        this.setState({ recurringExpenseDialogOpen: false, oneTimeExpenseDialogOpen: false });
    }

    handleSaveRecurringExpense() {

    }

    handleSaveOneTimeExpense() {

    }

    handleRecurringNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

    }

    handleRecurringStartDateChange(newDate: string | null, budgetIndex: number) {

    }

    handleRecurringEndDateChange(newDate: string | null, budgetIndex: number) {

    }


    render() {

        if (this.props.simulation && this.state.budgets) {
            return (
                <Box>

                    <Dialog open={this.state.recurringExpenseDialogOpen} onClose={this.closeDialog}>
                        <DialogTitle>Recurring Expense</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            </DialogContentText>

                            <Stack direction='column' spacing={0}>

                                <TextField label={'label'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleRecurringNameChange(event)} value={''} /><br /><br />
                                <TextField label={'amount'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleRecurringNameChange(event)} InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            Monthly
                                        </InputAdornment>
                                    ),
                                }} value={''}></TextField>
                                <br />    <br />
                                <Stack direction='row' spacing={2}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="start date"
                                            value={'1/1/2011'}
                                            onChange={(newDate) => this.handleRecurringStartDateChange(newDate, 1)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>


                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker

                                            label="end date"
                                            value={'1/1/2011'}
                                            onChange={(newDate) => this.handleRecurringEndDateChange(newDate, 1)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>

                                </Stack>

                            </Stack>



                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeDialog}>Cancel</Button>
                            <Button onClick={this.handleSaveRecurringExpense}>Save</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.oneTimeExpenseDialogOpen} onClose={this.closeDialog}>
                        <DialogTitle>One Time Expense</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeDialog}>Cancel</Button>
                            <Button onClick={this.handleSaveOneTimeExpense}>Save</Button>
                        </DialogActions>
                    </Dialog>

                    <Box>
                        <h1>Incomes</h1>
                        <br />

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography><b>Recurring Expenses</b><br />${this.getAvgMonthlyExpenses(this.state.budgets)} / month</Typography>


                            </AccordionSummary>

                            <AccordionDetails>
                                {this.state.budgets.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1).map((budget: Budget, i: number) => {
                                    if (budget.type === CategoryTypes.Income) {
                                        return (
                                            <>
                                                <Card variant="outlined" >
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Typography ><b>{budget.name}</b></Typography>
                                                                <Typography>{this.pretyDate(budget.startDate)} - {this.pretyDate(budget.endDate)}</Typography>
                                                                <Button onClick={(e) => this.editRecurringExpense(e)}><EditIcon /></Button>
                                                                <Button><DeleteIcon /></Button>
                                                            </Grid>

                                                            <Grid item xs={4}>
                                                                <Typography ><b>${budget.getSum().toFixed(2)} / mo</b></Typography>
                                                            </Grid>

                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                                <br />
                                            </>
                                        )
                                    }

                                })}
                                <Button style={{ width: "100%" }} key={'add'} onClick={(e) => this.handleDeleteCategory(e)} variant="outlined">add recurring expense <AddCircleIcon /></Button>
                            </AccordionDetails>AddCircleIcon

                        </Accordion>

                        <br />
                        <br />

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >

                                <Typography><b>One-time Expenses</b><br />${this.getEventsTotal(this.state.events)} total</Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                {this.state.events.sort((a, b) => (a.date > b.date) ? 1 : -1).map((event: Event, i: number) => {
                                    if (event.type === CategoryTypes.Income) {
                                        return (
                                            <>
                                                <Card variant="outlined" >
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Typography ><b>{event.name}</b></Typography>
                                                                <Typography>from account: {event.account}</Typography>
                                                                <Button onClick={(e) => this.editOneTimeExpense(e)}><EditIcon /></Button>
                                                                <Button><DeleteIcon /></Button>
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
                                    }

                                })}
                                <Button style={{ width: "100%" }} key={'add'} onClick={(e) => this.handleDeleteCategory(e)} variant="outlined">add one-time expense <AddCircleIcon /></Button>
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

export default IncomesView;
