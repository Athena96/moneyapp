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
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Link } from "react-router-dom";
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';
import { BudgetFactory } from '../model/FactoryMethods/BudgetFactory';
import { getObjectWithId } from '../utilities/helpers';
import { CategoryTypes } from '../API';

Amplify.configure(awsExports);

interface BudgetsViewProps {
  value: number;
  index: number;
  user: string;
  simulation: Simulation;
}

interface IState {
  name: string,
  budgets: Budget[],
  dropdowns: any;
}

class BudgetsView extends React.Component<BudgetsViewProps, IState> {

  constructor(props: BudgetsViewProps) {

    super(props);

    this.state = {
      name: 'BudgetsView',
      budgets: [],
      dropdowns: {}
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDeleteBudget = this.handleDeleteBudget.bind(this);
    this.handleAddBudget = this.handleAddBudget.bind(this);
    this.handleDuplicateBudget = this.handleDuplicateBudget.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    await BudgetDataAccess.fetchBudgetsForSelectedSim(this, this.props.simulation.getKey());
  }

  async handleAddBudget() {
    try {
      let newBudget: any = new Budget(new Date().getTime().toString(), '...', new Date(), new Date(), null);
      newBudget['simulation'] = this.props.simulation.id;

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
      newBudget['simulation'] = this.props.simulation.id;

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

  handleChange = (panel: string) => (
    event: React.ChangeEvent<unknown>,
    isExpanded: boolean,
  ) => {
    let mp = this.state.dropdowns;
    if (mp[panel] && mp[panel] === false) {
      mp[panel] = true;
    } else {
      mp[panel] = false;
    }
    this.setState({ dropdowns: mp });
  }

  render() {
    return this.props.index === this.props.value ? (
      <>
        <Button style={{ width: "100%" }} onClick={this.handleAddBudget} variant="outlined">Add Budget</Button>
        <br />   <br />
        {this.state.budgets.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1).map((budget: Budget) => {

          let invest = null;
          if (budget.categories) {
            invest = 0;
            for (const cat of budget.categories) {
              if (cat.name.toLowerCase().match(/tax/)) continue;
              if (cat.name.includes('paycheck')) {
                invest += cat.value;
              } else {
                invest -= cat.value;
              }
            }
          }

          const monthlySpending = budget.getTypeSum(CategoryTypes.Expense);
          const annualTaxes = (monthlySpending * 12 / 2.0) * 0.15;
          return (
            <>
              <Accordion key={budget.getKey()} expanded={this.state.dropdowns[budget.getKey()]} onChange={this.handleChange(budget.getKey())}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {budget.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>

                    <b>Start</b>: {budget.startDate.getMonth() + 1}/{budget.startDate.getDate()}/{budget.startDate.getFullYear()} &nbsp; <i>Age</i> &nbsp;{Number(String(budget.startDate.getFullYear()).slice(-2)) + 4}  &nbsp; <b>End</b>: {budget.endDate.getMonth() + 1}/{budget.endDate.getDate()}/{budget.endDate.getFullYear()} &nbsp;<i>Age</i>&nbsp; {Number(String(budget.endDate.getFullYear()).slice(-2)) + 4}&nbsp;
                    [{budget.endDate.getFullYear() - budget.startDate.getFullYear()} YRs]&nbsp;

                    {
                      invest && invest! < 0 ?
                        <> (Annual Spending: <b> ${(-1 * ((invest * 12) / 1000)).toFixed(0)}K</b>)  (Annual taxes: <b>${annualTaxes.toFixed(2)}</b>)
                        </> : <></>
                    }

                  </Typography>
                </AccordionSummary>
                <AccordionDetails>

                  <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                    <CardContent>

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

                        <Stack direction='row' spacing={1}>
                          <Button id={budget.getKey()} onClick={this.handleDeleteBudget} variant="outlined">Delete</Button>
                          <Button id={budget.getKey()} onClick={this.handleDuplicateBudget} variant="contained">Duplicate</Button>
                          <Link style={{ color: 'white', textDecoration: 'none' }} to={`/budgets/${budget.getKey()}`}><Button id={budget.getKey()} onClick={this.handleEditBudget} variant="contained">Edit</Button></Link>

                        </Stack>

                      </CardActions>
                    </CardContent>
                  </Card>

                </AccordionDetails>
              </Accordion>
              <br />
            </>
          )
        })}
      </>
    ) : (<></>);
  }

}

export default BudgetsView;
