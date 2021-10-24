import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createBudget, deleteBudget } from '../graphql/mutations'
import awsExports from "../aws-exports";
import { Simulation } from '../model/Base/Simulation';

import { Budget } from '../model/Base/Budget';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';
import { BudgetFactory } from '../model/FactoryMethods/BudgetFactory';
import { getObjectWithId } from '../utilities/helpers';

Amplify.configure(awsExports);

interface BudgetsViewProps {
  value: number;
  index: number;
}

interface IState {
  name: string,
  budgets: Budget[],
  selectedSimulation: Simulation | null
}

class BudgetsView extends React.Component<BudgetsViewProps, IState> {

  constructor(props: BudgetsViewProps) {

    super(props);

    this.state = {
      name: 'BudgetsView',
      budgets: [],
      selectedSimulation: null

    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDeleteBudget = this.handleDeleteBudget.bind(this);
    this.handleAddBudget = this.handleAddBudget.bind(this);
    this.handleDuplicateBudget = this.handleDuplicateBudget.bind(this);
    this.render = this.render.bind(this);
  }


  componentDidMount() {
    SimulationDataAccess.fetchSimulations(this).then((simulations) => {
      BudgetDataAccess.fetchBudgets(this, simulations);
    });
  }

  async handleAddBudget() {
    try {
      let newBudget: any = new Budget(new Date().getTime().toString(), '...', new Date(), new Date(), null);
      newBudget['simulation'] = this.state.selectedSimulation!.id;

      let newBudgets = [...this.state.budgets, newBudget]
      this.setState({ budgets: newBudgets });
      await API.graphql(graphqlOperation(createBudget, { input: newBudget }))
    } catch (err) {
      console.log('error creating todo:', err)
    }

  }

  async handleDuplicateBudget(event: any) {
    const idToDuplicate = (event.target as Element).id;
    const budgetToDuplicate = getObjectWithId(idToDuplicate, this.state.budgets)! as Budget;
    try {
      let newBudget: any = BudgetFactory.fromBudget(budgetToDuplicate);
      newBudget['simulation'] = this.state.selectedSimulation!.id;

      let newBudgets = [...this.state.budgets, newBudget]
      this.setState({ budgets: newBudgets });
      await API.graphql(graphqlOperation(createBudget, { input: newBudget }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async handleDeleteBudget(event: any) {
    if (window.confirm('Are you sure you want to DELETE this Budget?')) {
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
    } else {
      console.log('did not delete the budget.')
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

          let invest = null;
          if (budget.categories) {
            invest = 0;
            for (const cat of budget.categories) {
              if (cat.name.includes('paycheck')) {
                invest += cat.value;
              } else {
                invest -= cat.value;
              }
            }
          }

          return (

            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
              <CardContent>

                <Stack direction='row' spacing={4}>
                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>name: </b> {budget.name}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>start: </b> {budget.startDate.toString()}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>end: </b>  {budget.endDate.toString()}
                  </Typography>

                </Stack>


                {
                  invest ?
                    <><Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                      <b>invest: </b> (per month)<b>${invest.toFixed(2)}</b>   (per year)<b>${(invest * 12).toFixed(2)}</b>
                    </Typography></> : <></>
                }

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
                    <Button id={budget.getKey()} onClick={this.handleDuplicateBudget} variant="contained">Duplicate</Button>
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
