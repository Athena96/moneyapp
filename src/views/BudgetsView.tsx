import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createBudget, deleteBudget } from '../graphql/mutations'
import awsExports from "../aws-exports";

import { Budget } from '../model/Budget';
import { fetchBudgets } from '../utilities/helpers';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";

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
      budgets: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDeleteBudget = this.handleDeleteBudget.bind(this);
    this.handleAddBudget = this.handleAddBudget.bind(this);
    this.render = this.render.bind(this);
  }


  componentDidMount() {
    fetchBudgets(this);
  }

  async handleAddBudget() {
    try {
      let newBudget = new Budget(new Date().getTime().toString(), '...', new Date(), new Date(), null);
      let newBudgets = [...this.state.budgets, newBudget]
      this.setState({ budgets: newBudgets });
      await API.graphql(graphqlOperation(createBudget, { input: newBudget }))
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
      await API.graphql({ query: deleteBudget, variables: { input: budgetToDelete } });
    } catch (err) {
      console.log('error:', err)
    }
  }

  handleEditBudget(event: any) {
    console.log((event.target as Element).id);
  }

  render() {
    return this.props.index === this.props.value ? (
      <>
        <Button style={{ width: "100%" }} onClick={this.handleAddBudget} variant="outlined">Add Budget</Button>

        {this.state.budgets.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1).map((budget: Budget) => {
          return (

            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
              <CardContent>

                <Stack direction='row' spacing={4}>
                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>name: </b> {budget.name}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>start: </b> {(budget.startDate.getMonth() + 1).toString()}/{budget.startDate.getFullYear().toString()}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>end: </b>  {(budget.endDate.getMonth() + 1).toString()}/{budget.endDate.getFullYear().toString()}
                  </Typography>
                </Stack>

                <Stack direction='row' spacing={4}>

                  <Stack direction='column' spacing={0}>
                    {budget.categories?.map((c, i) => {
                      return (
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          <b>{c.name}</b>
                        </Typography>
                      )
                    })}

                  </Stack>

                  <Stack direction='column' spacing={0}>
                    {budget.categories?.map((c, i) => {
                      return (
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          ${c.value}
                        </Typography>
                      )
                    })}

                  </Stack>
                </Stack>

                <CardActions>

                  <Stack direction='row' spacing={4}>
                    <Button id={budget.getKey()} onClick={this.handleDeleteBudget} variant="outlined">Delete</Button>
                    <Link style={{ color: 'white', textDecoration: 'none' }} to={`/budgets/${budget.getKey()}`}><Button id={budget.getKey()} onClick={this.handleEditBudget} variant="contained">Edit</Button></Link>

                  </Stack>

                </CardActions>
              </CardContent>
            </Card>
          )
        })}
      </>
    ) : (<></>);
  }

}

export default BudgetsView;
