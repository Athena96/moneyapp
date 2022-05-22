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
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

Amplify.configure(awsExports);

interface ExpensesViewProps {
  user: string;
  simulation: Simulation | undefined;
  type: CategoryTypes;
}

interface IState {
  budgets: Budget[],
  events: Event[],
  accounts: Account[]
}

class ExpensesView extends React.Component<ExpensesViewProps, IState> {

  constructor(props: ExpensesViewProps) {

    super(props);

    this.state = {
      budgets: [],
      events: [],
      accounts: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleRecurringNameChange = this.handleRecurringNameChange.bind(this);
    this.handleRecurringStartDateChange = this.handleRecurringStartDateChange.bind(this);
    this.handleRecurringEndDateChange = this.handleRecurringEndDateChange.bind(this);
    this.handleRecurringCategoryNameChange = this.handleRecurringCategoryNameChange.bind(this);
    this.handleRecurringCategoryValueChange = this.handleRecurringCategoryValueChange.bind(this);
  }

  async componentDidMount() {
    if (this.props.simulation) {
      await BudgetDataAccess.fetchBudgetsForSelectedSim(this, this.props.simulation.getKey());
      await EventDataAccess.fetchEventsForSelectedSim(this, this.props.simulation.getKey());
      await AccountDataAccess.fetchAccountsForUserSelectedSim(this, this.props.simulation.getKey());
    }
  }

  handleRecurringNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, budgetIndex: number) {
    const newValue: string = event.target.value;
    const newBudgets = [...this.state.budgets];
    newBudgets[budgetIndex].name = newValue;
    this.setState({budgets: newBudgets})
  }

  handleRecurringStartDateChange(newDate: Date | null, budgetIndex: number) {
    const newBudgets = [...this.state.budgets];
    if (newDate) {
      newBudgets[budgetIndex].startDate = newDate;
    }
    this.setState({budgets: newBudgets})
  }

  handleRecurringEndDateChange(newDate: Date | null, budgetIndex: number) {
    const newBudgets = [...this.state.budgets];
    if (newDate) {
      newBudgets[budgetIndex].endDate = newDate;
    }
    this.setState({budgets: newBudgets})
  }

  handleRecurringCategoryNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, budgetIndex: number, catIndex: number) {
    const newCatName: string = event.target.value;
    const newBudgets = [...this.state.budgets];
    if (newBudgets && newBudgets[budgetIndex] && newBudgets[budgetIndex].categories) {
      newBudgets[budgetIndex].categories![catIndex].name = newCatName;
      this.setState({budgets: newBudgets})
    }
  }

  handleRecurringCategoryValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, budgetIndex: number, catIndex: number) {
    const newCatValue: number = Number(event.target.value);
    const newBudgets = [...this.state.budgets];
    if (newBudgets && newBudgets[budgetIndex] && newBudgets[budgetIndex].categories) {
      newBudgets[budgetIndex].categories![catIndex].value = newCatValue;
      this.setState({budgets: newBudgets})
    }
  }

  async handleAddBudget(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, simulationId: string) {
    try {
      let newBudet: any = new Budget(new Date().getTime().toString(), "...", new Date(), new Date(), null,  this.props.type);
      newBudet['simulation'] = this.props.simulation!.getKey();

      let newBudgets = [...this.state.budgets, newBudet]
      this.setState({ budgets: newBudgets });
      await API.graphql(graphqlOperation(createBudget, { input: newBudet }))
    } catch (err) {
        console.log('error creating todo:', err)
    }
  }

  async handleAddEvent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, simulationId: string) {
    try {
      const cat = new Category(new Date().getTime().toString(), '...', 0.0);
      let newEvent: any = new Event(new Date().getTime().toString(), "...", new Date(), "", cat, this.props.type);
      newEvent['simulation'] = this.props.simulation!.getKey();

      let newEvents = [...this.state.events, newEvent]
      this.setState({ events: newEvents });

      await API.graphql(graphqlOperation(createEvent, { input: newEvent }));

    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  handleAddCategory(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, budgetIndex: number) {
    try {
      let newCategory = new Category(new Date().getTime().toString(), "...", 0);
      let newBudgets = [...this.state.budgets]
      
      if (newBudgets[budgetIndex].categories) {
        newBudgets[budgetIndex].categories?.push(newCategory)
      } else {
        newBudgets[budgetIndex].categories = [newCategory]
      }
      this.setState({ budgets: newBudgets });
    } catch (err) {
        console.log('error creating todo:', err)
    }
  }

  handleDeleteCategory(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, budgetIndex: number, categoryIndex: number) {
    try {

      let newBudgets = [...this.state.budgets]
      
      if (newBudgets[budgetIndex].categories) {
        delete newBudgets[budgetIndex].categories![categoryIndex];
      }
      this.setState({ budgets: newBudgets });
    } catch (err) {
        console.log('error creating todo:', err)
    }
  }

  async handleDeleteBudget(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, budgetIndex: number) {
    try {
      const budgetIdToDelete = this.state.budgets[budgetIndex].getKey();
      let newBudgets = [...this.state.budgets]
      delete newBudgets[budgetIndex];
      this.setState({ budgets: newBudgets });
      const budgetToDelete = {
        'id': budgetIdToDelete
      }
      await API.graphql({ query: deleteBudget, variables: { input: budgetToDelete } });
    } catch (err) {
        console.log('error creating todo:', err)
    }
  }

  async handleSaveBudget(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, budgetIndex: number) {
    try {
      const budgetToSave = this.state.budgets[budgetIndex];
      await API.graphql({ query: updateBudget, variables: { input: budgetToSave } });
    } catch (err) {
        console.log('error creating todo:', err)
    }
  }

  async handleDeleteEvent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, eventIndex: number) {
    try {
      const eventIdToDelete = this.state.events[eventIndex].getKey();
      let newEvents = [...this.state.events]
      delete newEvents[eventIndex];
      this.setState({ events: newEvents });
      const eventToDelete = {
        'id': eventIdToDelete
      }
      await API.graphql({ query: deleteEvent, variables: { input: eventToDelete } });
    } catch (err) {
        console.log('error creating todo:', err)
    }
  }

  async handleSaveEvent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, eventIndex: number) {
    try {
      const eventToSave = this.state.events[eventIndex];
      await API.graphql({ query: updateEvent, variables: { input: eventToSave } });
    } catch (err) {
        console.log('error creating todo:', err)
    }
  }


  handleOneTimeNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, eventIndex: number) {
    const newValue: string = event.target.value;
    const newEvents = [...this.state.events];
    newEvents[eventIndex].name = newValue;
    this.setState({events: newEvents})
  }


  handleOneTimeDateChange(newDate: Date | null, eventIndex: number) {
    const newEvents = [...this.state.events];
    if (newDate) {
      newEvents[eventIndex].date = newDate;
    }
    this.setState({events: newEvents})
  }

  handleOneTimeCategoryNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, eventIndex: number) {
    const newValue: string = event.target.value;
    const newEvents = [...this.state.events];
    newEvents[eventIndex].category!.name = newValue;
    this.setState({events: newEvents})
  }

  handleOneTimeCategoryValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, eventIndex: number) {
    let newValue: number;
    try {
      newValue = Number(event.target.value)
    } catch(e) {
      console.log('errr')
      newValue = 0.0;
    }
    const newEvents = [...this.state.events];
    newEvents[eventIndex].category!.value = newValue;
    this.setState({events: newEvents})
  }
  render() {
    console.log(JSON.stringify(this.state.budgets));
    if (this.props.simulation && this.state.budgets) {
      return (
        <Box>
        {this.props.type === CategoryTypes.Expense ? <h1>Expenses</h1> : <h1>Incomes</h1>}
          <br/>  
        
          <h2>Recurring (monthly)</h2>
          {this.state.budgets.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1).map((budget: Budget, i: number) => {
            if (budget.type === this.props.type) {
              return (
                <>
                <Card variant="outlined" >
                  <CardContent>
                    <Stack direction='column' spacing={2}>
  
                      <Stack direction='row' spacing={2}>
                      <TextField key={i} label={this.props.type.toString().toLowerCase()} id="outlined-basic" variant="outlined" name={`name`} onChange={(event) => this.handleRecurringNameChange(event,i)} value={budget.name} />
  
                      <LocalizationProvider  dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="start date"
                          value={budget.startDate}
                          onChange={(newDate) => this.handleRecurringStartDateChange(newDate, i)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
  
                  
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
  
                          label="end date"
                          value={budget.endDate}
                          onChange={(newDate) => this.handleRecurringEndDateChange(newDate, i)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
  
                      </Stack>
  
                      {budget.categories?.map((category: Category, j: number) => {
                          return (
                            <Stack direction='row' spacing={2}>
    
                              <TextField style={{ width: "100%" }} key={i+j+'item'} label="item" id="outlined-basic" variant="outlined" name={`name`} onChange={(event) => this.handleRecurringCategoryNameChange(event,i,j)} value={category.name} />
                              <TextField style={{ width: "100%" }} key={i+j+'value'} label="value" id="outlined-basic" variant="outlined" name={`name`} onChange={(event) => this.handleRecurringCategoryValueChange(event,i,j)} value={category.value} />
                              <Button style={{ width: "100%" }} key={i+'deleteCategory'} onClick={(e) => this.handleDeleteCategory(e, i, j)} variant="outlined">delete</Button>
    
                            </Stack>
    
                          )
                      })}
  
                      <Button key={i+'addCategory'} style={{ width: "100%" }} onClick={(e) => this.handleAddCategory(e, i)} variant="outlined">Add Category</Button>
  
                      <Stack direction='row' spacing={2}>
  
                        <Button style={{ width: "50%" }} key={i+'delete'} onClick={(e) => this.handleDeleteBudget(e, i)} variant="outlined">delete</Button>
                        <Button style={{ width: "50%" }} key={i+'save'} onClick={(e) => this.handleSaveBudget(e, i)} variant="outlined">save</Button>
  
                      </Stack>
  
                    </Stack>
                  </CardContent>
                </Card>
                <br />
                </>
              )
            }
          })}
          <br />

          <Button key={'addBudget'} style={{ width: "100%" }} onClick={(e) => this.handleAddBudget(e, this.props.simulation!.id)} variant="outlined">Add Budget</Button>
        
          <br />

          <h2>One Time</h2>
          {this.state.events.sort((a, b) => (a.date > b.date) ? 1 : -1).map((event: Event, i: number) => {

            if (event.type === this.props.type) {
              return (
                <>
                <Card variant="outlined" >
                  <CardContent>
                    <Stack direction='column' spacing={2}>
                    <TextField key={i} label={`one time ${this.props.type.toString().toLowerCase()}`} id="outlined-basic" variant="outlined" name={`name`} onChange={(e) => this.handleOneTimeNameChange(e,i)} value={event.name} />
  
                      <Stack direction='row' spacing={2}>
  
                      <LocalizationProvider  dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="date"
                          value={event.date}
                          onChange={(newDate) => this.handleOneTimeDateChange(newDate, i)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
  
  
                        <TextField style={{ width: "100%" }} key={i+'item'} label="item" id="outlined-basic" variant="outlined" name={`name`} onChange={(e) => this.handleOneTimeCategoryNameChange(e,i)} value={event.category ? event.category!.name : ""} />
                        <TextField style={{ width: "100%" }} key={i+'value'} label="value" id="outlined-basic" variant="outlined" name={`value`} onChange={(e) => this.handleOneTimeCategoryValueChange(e,i)} value={event.category ? event.category!.value : ""} />
  
                      </Stack>
  
                      <Stack direction='row' spacing={2}>
  
                        <Button style={{ width: "50%" }} key={i+'delete'} onClick={(e) => this.handleDeleteEvent(e, i)} variant="outlined">delete</Button>
                        <Button style={{ width: "50%" }} key={i+'save'} onClick={(e) => this.handleSaveEvent(e, i)} variant="outlined">save</Button>
  
                      </Stack>
  
                    </Stack>
                  </CardContent>
                </Card>
                <br />
                </>
              )
            }

          })}

          <Button key={'addEvents'} style={{ width: "100%" }} onClick={(e) => this.handleAddEvent(e, this.props.simulation!.id)} variant="outlined">Add Event</Button>

        </Box>)
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
