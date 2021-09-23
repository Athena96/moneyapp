import * as React from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';

// import '../App.css';
// import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
// import { CategoryTypes } from '../model/Category';
import { Category, CategoryTypes } from '../model/Category';

// import { getEvents, getBudgets } from '../utilities/dataSetup';
// import { dateRange, generateTable } from '../utilities/helpers';
// import { Line } from "react-chartjs-2";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getBudgets } from '../utilities/dataSetup';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import TextField from '@mui/material/TextField';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createBudget, deleteBudget } from '../graphql/mutations'
import { listBudgets } from '../graphql/queries'
import { ListBudgetsQuery, OnCreateBudgetSubscription } from "../API";

import { GraphQLResult } from "@aws-amplify/api";

import awsExports from "../aws-exports";
import { PickersCalendarHeaderComponentsPropsOverides } from '@mui/lab/CalendarPicker/PickersCalendarHeader';
Amplify.configure(awsExports);

interface BudgetsViewProps {
  value: number;
  index: number;
}

interface IState {
  name: string,
  budgets: Budget[]
}

class BudgetsView extends React.Component<BudgetsViewProps, IState> {

  constructor(props: BudgetsViewProps) {

    super(props);

    this.state = {
      name: 'BudgetsView',
      budgets: [] //getBudgets()
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.fetchBudgets = this.fetchBudgets.bind(this);

    this.handleDeleteBudget = this.handleDeleteBudget.bind(this);
    this.handleAddBudget = this.handleAddBudget.bind(this);
    this.render = this.render.bind(this);
  }


  componentDidMount() {
    this.fetchBudgets();
  }

  async fetchBudgets() {
    let fetchedBudgets: Budget[] = [];
    try {
      const response = (await API.graphql({
        query: listBudgets
      })) as { data: ListBudgetsQuery }
      for (const budget of response.data.listBudgets!.items!) {
        let cats = []
        for (const category of budget!.categories!) {
          cats.push(new Category(category!.name!, category!.value!, (category!.type!.toString() === "Expense" ? CategoryTypes.Expense : CategoryTypes.Income), null));
        }
        fetchedBudgets.push(new Budget(budget!.id!, budget!.name!, new Date(budget!.startDate!), new Date(budget!.endDate!), cats));
      }
      this.setState({budgets: fetchedBudgets})
    } catch (error) {
      console.log(error);
    }
  }

  async handleAddBudget() {


    try {

      let c: Category[] =[]
      let newBudget = new Budget('','...', new Date(), new Date(), null);
      let newBudgets = [...this.state.budgets, newBudget]
      this.setState({ budgets: newBudgets });
      await API.graphql(graphqlOperation(createBudget, {input: { categories: c, name: '...', startDate: new Date(), endDate: new Date()}}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
    
  }

  async handleDeleteBudget(event: any) {
    const idToDelete = (event.target as Element).id;
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
      await API.graphql({ query: deleteBudget, variables: {input: budgetToDelete}});
    } catch (err) {
      console.log('error:', err)
    }
  }

  handleEditBudget(event: any) {
    const idToEdit = (event.target as Element).id;

    console.log(idToEdit);
  }

  render() {
    return this.props.index === this.props.value ? (
      <div >
        <Button style={{ margin: '15px', width: "100%" }} onClick={this.handleAddBudget} variant="outlined">Add Budget</Button>

        {this.state.budgets.map((budget: Budget) => {
          return (

            <Card variant="outlined" style={{ margin: '15px' }}>
              <CardContent>

                <Stack direction='row' spacing={4}>
                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    {budget.name}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    {(budget.startDate.getMonth() + 1).toString()}/{budget.startDate.getFullYear().toString()}
                  </Typography>
                  
                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    {(budget.endDate.getMonth() + 1).toString()}/{budget.endDate.getFullYear().toString()}
                  </Typography>

                  <CardActions>

                    <Button id={budget.getKey()} onClick={this.handleEditBudget} variant="outlined">Edit</Button>
                    <Button id={budget.getKey()} onClick={this.handleDeleteBudget} variant="contained">Delete Budget</Button>

                  </CardActions>

                </Stack>
              </CardContent>
            </Card>

          )
        })}
      </div>
    ) : (<></>);
  }

}

export default BudgetsView;