import * as React from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';

// import '../App.css';
// import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Category } from '../model/Category';
// import { CategoryTypes } from '../model/Category';

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
      budgets: getBudgets()
    }

    this.handleDeleteBudget = this.handleDeleteBudget.bind(this);
    this.handleAddBudget = this.handleAddBudget.bind(this);
    this.render = this.render.bind(this);
  }

  handleAddBudget() {
    let emptarr: Category[] = [];
    let newBudget = new Budget('...', new Date(), new Date(), emptarr);
    let newBudgets = [...this.state.budgets, newBudget]
    this.setState({ budgets: newBudgets });
  }

  handleDeleteBudget(event: any) {
    const idToDelete = (event.target as Element).id;
    let newBudgets = [];
    for (const budget of this.state.budgets) {
      if (budget.getKey() !== idToDelete) {
        newBudgets.push(budget);
      }
    }
    this.setState({ budgets: newBudgets });
  }

  handleEditBudget(event: any) {
    const idToEdit = (event.target as Element).id;

    console.log(idToEdit)
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
