import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createBudget, createEvent, deleteBudget, deleteEvent, updateBudget, updateEvent } from '../graphql/mutations'

import awsExports from "../aws-exports";
import { Simulation } from '../model/Base/Simulation';
import Box from '@mui/material/Box';

import { Budget } from '../model/Base/Budget';
import { Link } from "react-router-dom";

import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { BudgetDataAccess } from '../utilities/BudgetDataAccess';


import { EventDataAccess } from '../utilities/EventDataAccess';
import { Account } from '../model/Base/Account';
import { Event } from '../model/Base/Event';

import { AccountDataAccess } from '../utilities/AccountDataAccess';

import TextField from '@mui/material/TextField';

import { CategoryTypes } from '../API';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

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

import InputAdornment from '@mui/material/InputAdornment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { cleanNumberDataInput } from '../utilities/helpers';
import { Category } from '../model/Base/Category';
Amplify.configure(awsExports);

interface ExpensesViewProps {
  user: string;
  simulation: Simulation | undefined;

}

interface IState {
  budgets: Budget[],
  events: Event[],
  accounts: Account[],
  recurringExpenseDialogOpen: boolean,
  oneTimeExpenseDialogOpen: boolean,
  budgetToEdit: Budget | undefined,
  eventToEdit: Event | undefined
}

class ExpensesView extends React.Component<ExpensesViewProps, IState> {

  constructor(props: ExpensesViewProps) {

    super(props);

    this.state = {
      budgets: [],
      events: [],
      accounts: [],
      recurringExpenseDialogOpen: false,
      oneTimeExpenseDialogOpen: false,
      budgetToEdit: undefined,
      eventToEdit: undefined
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.editRecurringExpense = this.editRecurringExpense.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleSaveRecurringExpense = this.handleSaveRecurringExpense.bind(this);
    this.handleSaveOneTimeExpense = this.handleSaveOneTimeExpense.bind(this);
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
      let newBudget: any = new Budget(new Date().getTime().toString(), '...', new Date(), new Date(), [new Category('1', '...', 0.0)], CategoryTypes.Expense);

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
    if (date) {
      return `${date.getMonth() + 1}/${date.getFullYear()}`

    }
  }

  getAvgMonthlyExpenses(budgets: Budget[]) {
    // not weighted avg
    let count = budgets.map((budget: Budget) => {
      return budget.type === CategoryTypes.Expense ? 1 : 0
    }).reduce((p: number, c: number) => p + c, 0);

    let sum = budgets.map((budget: Budget) => {
      return budget.type === CategoryTypes.Expense ? budget.categories![0].getValue() : 0.0
    }).reduce((p: number, c: number) => p + c, 0);
    return (sum / count).toFixed(2);
  }


  getEventsTotal(events: Event[]) {

    let sum = events.map((event: Event) => {
      return event.type === CategoryTypes.Expense ? event.category?.value || 0 : 0.0
    }).reduce((p: number, c: number) => p + c, 0);
    return (sum).toFixed(2);
  }

  handleDeleteCategory(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

  }

  editRecurringExpense(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, budgetToEdit: Budget) {
    this.setState({ recurringExpenseDialogOpen: true, budgetToEdit: budgetToEdit });
  }

  editOneTimeExpense(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, eventToEdit: Event) {
    console.log('d ' + JSON.stringify(eventToEdit))
    this.setState({ oneTimeExpenseDialogOpen: true, eventToEdit: eventToEdit });
  }

  closeDialog() {
    this.setState({ recurringExpenseDialogOpen: false, oneTimeExpenseDialogOpen: false });
  }

  async handleSaveRecurringExpense() {
    if (this.state.budgetToEdit) {
      try {

        await API.graphql(graphqlOperation(updateBudget, { input: BudgetDataAccess.convertToDDBObject(this.state.budgetToEdit, this.props.simulation!.id) }))
      } catch (err) {
        console.log('error creating todo:', err)
      }
      this.closeDialog();
    }
  }

  async handleSaveOneTimeExpense() {
    if (this.state.eventToEdit) {
      try {

        await API.graphql(graphqlOperation(updateEvent, { input: EventDataAccess.convertToDDBObject(this.state.eventToEdit, this.props.simulation!.id) }))
      } catch (err) {
        console.log('error creating todo:', err)
      }
      this.closeDialog();
    }
  }

  handleRecurringNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newName = event.target.value;
    if (this.state.budgetToEdit) {
      const budget = this.state.budgetToEdit;
      budget.name = newName;
      this.setState({ budgetToEdit: budget })
    }
  }

  handleOneTimeValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newVal = event.target.value;
    console.log('newval ' + newVal)
    if (this.state.eventToEdit) {
      const event = this.state.eventToEdit;
      event.category!.setValue(cleanNumberDataInput(newVal));
      this.setState({ eventToEdit: event })
    }
  }

  handleOneTimeNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newName = event.target.value;
    if (this.state.eventToEdit) {
      const event = this.state.eventToEdit;
      event.name = newName;
      this.setState({ eventToEdit: event })
    }
  }

  handleRecurringValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newVal = event.target.value;
    console.log('newval ' + newVal)
    if (this.state.budgetToEdit) {
      const budget = this.state.budgetToEdit;
      budget.categories![0].setValue(cleanNumberDataInput(newVal));
      this.setState({ budgetToEdit: budget })
    }
  }

  handleRecurringStartDateChange(newDate: Date | null) {

    if (this.state.budgetToEdit && newDate) {
      const budget = this.state.budgetToEdit;
      budget.startDate = newDate;
      this.setState({ budgetToEdit: budget })
    }
  }

  handleRecurringEndDateChange(newDate: Date | null) {
    if (this.state.budgetToEdit && newDate) {
      const budget = this.state.budgetToEdit;
      budget.endDate = newDate;
      this.setState({ budgetToEdit: budget })
    }
  }

  handleOneTimeDateChange(newDate: Date | null) {
    if (this.state.eventToEdit && newDate) {
      const event = this.state.eventToEdit;
      event.date = newDate;
      this.setState({ eventToEdit: event })
    }
  }

  async handleAddEvent() {
    try {
      let newEvent: any = new Event(new Date().getTime().toString(), '...', new Date(), this.state.accounts[0].name, new Category('1', '...', 0.0), CategoryTypes.Expense);

      newEvent['simulation'] = this.props.simulation!.id;

      console.log("j " + JSON.stringify(newEvent))
      let formatedEvent = EventDataAccess.convertToDDBObject(newEvent, this.props.simulation!.id);
      console.log("jj " + JSON.stringify(formatedEvent))

      let newEvents = [...this.state.events, formatedEvent]
      this.setState({ events: newEvents });
      await API.graphql(graphqlOperation(createEvent, { input: formatedEvent }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async deleteRecurringExpense(budget: Budget) {
    const idToDelete = budget.id;
    if (window.confirm('Are you sure you want to DELETE this Recurring Expense?')) {
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

  async deleteOneTimeExpense(event: Event) {
    const idToDelete = event.id;
    if (window.confirm('Are you sure you want to DELETE this One Time Expense?')) {
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
      console.log('-' + JSON.stringify(this.state.budgets));
      return (
        <Box>

          <Dialog open={this.state.recurringExpenseDialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Recurring Expense</DialogTitle>
            <DialogContent>
              <DialogContentText>
              </DialogContentText>

              <Stack direction='column' spacing={0}>
                <br />
                {this.state.budgetToEdit && <TextField label={'label'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleRecurringNameChange(event)} value={this.state.budgetToEdit.name} />}<br />
                {this.state.budgetToEdit && <TextField label={'amount'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleRecurringValueChange(event)} InputProps={{
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
                }} value={this.state.budgetToEdit.categories![0].strValue}></TextField>}

                <br />
                <Stack direction='row' spacing={2}>

                  {this.state.budgetToEdit && <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="start date"
                      value={this.state.budgetToEdit.startDate}
                      onChange={(newDate) => this.handleRecurringStartDateChange(newDate)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>}


                  {this.state.budgetToEdit && <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker

                      label="end date"
                      value={this.state.budgetToEdit.endDate}
                      onChange={(newDate) => this.handleRecurringEndDateChange(newDate)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>}

                </Stack>

              </Stack>



            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Cancel</Button>
              <Button onClick={this.handleSaveRecurringExpense}>Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={this.state.oneTimeExpenseDialogOpen} onClose={this.closeDialog}>
            <DialogTitle>One-time Expense</DialogTitle>
            <DialogContent>
              <DialogContentText>
              </DialogContentText>

              <Stack direction='column' spacing={0}>
                <br />
                {this.state.eventToEdit && <TextField label={'label'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleOneTimeNameChange(event)} value={this.state.eventToEdit.name} />}<br />
                {this.state.eventToEdit && <TextField label={'amount'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleOneTimeValueChange(event)} InputProps={{
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
                }} value={this.state.eventToEdit.category!.strValue}></TextField>}

                <br />
                <Stack direction='row' spacing={2}>

                  {this.state.eventToEdit && <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="date"
                      value={this.state.eventToEdit.date}
                      onChange={(newDate) => this.handleOneTimeDateChange(newDate)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>}

                </Stack>

              </Stack>



            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Cancel</Button>
              <Button onClick={this.handleSaveOneTimeExpense}>Save</Button>
            </DialogActions>
          </Dialog>

          <Box>
            <h1>Expenses</h1>
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
                  if (budget.type === CategoryTypes.Expense) {
                    return (
                      <>
                        <Card variant="outlined" >
                          <CardContent>
                            <Grid container>
                              <Grid item xs={8}>
                                <Typography ><b>{budget.name}</b></Typography>
                                <Typography>{this.pretyDate(budget.startDate)} - {this.pretyDate(budget.endDate)}</Typography>
                                <Button onClick={(e) => this.editRecurringExpense(e, budget)}><EditIcon /></Button>
                                <Button onClick={(e) => this.deleteRecurringExpense(budget)}><DeleteIcon /></Button>
                              </Grid>

                              <Grid item xs={4}>
                                <Typography ><b>${budget.categories![0].value.toFixed(2)} / mo</b></Typography>
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
                <Button style={{ width: "100%" }} key={'add'} onClick={(e) => this.handleAddBudget(e)} variant="outlined">add recurring expense <AddCircleIcon /></Button>
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
                <Typography><b>One-time Expenses</b><br />${this.getEventsTotal(this.state.events)} total</Typography>

              </AccordionSummary>
              <AccordionDetails>
                {this.state.events.sort((a, b) => (a.date > b.date) ? 1 : -1).map((event: Event, i: number) => {
                  if (event.type === CategoryTypes.Expense) {
                    return (
                      <>
                        <Card variant="outlined" >
                          <CardContent>
                            <Grid container>
                              <Grid item xs={8}>
                                <Typography ><b>{event.name}</b></Typography>
                                <Typography>from account: {event.account}</Typography>
                                <Button onClick={(e) => this.editOneTimeExpense(e, event)}><EditIcon /></Button>
                                <Button onClick={(e) => this.deleteOneTimeExpense(event)}><DeleteIcon /></Button>
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
                <Button style={{ width: "100%" }} key={'add'} onClick={(e) => this.handleAddEvent()} variant="outlined">add one-time expense <AddCircleIcon /></Button>
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

export default ExpensesView;
