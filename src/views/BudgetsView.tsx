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

    this.render = this.render.bind(this);
  }

  render() {
    return this.props.index === this.props.value ? (
      <div >
        <Button style={{margin: '15px'}} variant="outlined">Add Budget</Button>

          {this.state.budgets.map((budget: Budget) => {
              return (

                <Card variant="outlined" style={{margin: '15px' }} sx={{  minWidth: 275}}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b><TextField id="outlined-basic" label={budget.name} placeholder={budget.name} variant="outlined" />
</b>: <TextField id="outlined-basic" label={budget.startDate.toString()} placeholder={budget.startDate.toString()} variant="outlined" /> - <TextField id="outlined-basic" label={budget.endDate.toString()} placeholder={budget.endDate.toString()} variant="outlined" />
                  </Typography>
                 
                  {budget.categories.map((category: Category) => (
                      <>
                    <TextField id="outlined-basic" label={category.name} placeholder={category.name} variant="outlined" />
                    <TextField id="outlined-basic" label={category.getValue().toString()} placeholder={category.getValue().toString()} variant="outlined" /><br/></>
                    ))}


                </CardContent>       
              </Card>

              )
          })}
      </div>
    ) : (<></>);
  }

}

export default BudgetsView;
