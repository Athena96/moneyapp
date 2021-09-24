import * as React from 'react';

import Amplify, { API } from 'aws-amplify'
import { getBudget } from '../../graphql/queries'
import awsExports from "../../aws-exports";
import { CategoryTypes, GetBudgetQuery } from "../../API";

import { Budget } from '../../model/Budget';
import { Category } from '../../model/Category';

import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

Amplify.configure(awsExports);

interface BudgetDetailProps {
}


interface IState {
  budget: Budget | null;
}
class BudgetDetailView extends React.Component<BudgetDetailProps, IState> {
  constructor(props: BudgetDetailProps) {
    super(props);
    this.state = {
      budget: null
    }
    this.handleAddCategory = this.handleAddCategory.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.fetchBudget = this.fetchBudget.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {

    this.fetchBudget(window.location.pathname.split('/')[2])
  }

  handleSave() {

  }

  handleAddCategory() {

    let currCategories: Category[] = [];

    if (this.state.budget?.categories) {
      currCategories = this.state.budget!.categories!;
    }

    currCategories.push(new Category('', '', 0, CategoryTypes.Expense));
    let currB = this.state.budget;
    currB!.categories = currCategories;
    this.setState({
      budget: currB
    });

  }

  async fetchBudget(budgetId: string) {
    try {
      const ee = await API.graphql({ query: getBudget, variables: { id: budgetId } }) as { data: GetBudgetQuery }
      const e = ee.data!.getBudget!;
      let cats: Category[] | null = null;
      if (e.categories) {
        cats = []
        for (const c of e.categories!) {
          cats.push(new Category(c?.id!, c?.name!, c?.value!, c?.type!));
        }
      }
      const budget = new Budget(e!.id!, e!.name!, new Date(e!.startDate!), new Date(e!.endDate!), cats);

      this.setState({ budget: budget });
    } catch (err) {
      console.log('error:', err)
    }

  }


  render() {
    return (
      <div>
        <Container sx={{ marginTop: '55px' }} maxWidth="sm">
          <Stack spacing={2}>
            <p><b><b>name</b></b></p>
            <TextField id="outlined-basic" variant="outlined" value={this.state.budget?.name ? this.state.budget?.name : '...'} />
            <p><b>start date</b></p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Basic example"
                value={this.state.budget?.startDate}
                onChange={(newValue) => {
                  // setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <p><b>end date</b></p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Basic example"
                value={this.state.budget?.endDate}
                onChange={(newValue) => {
                  // setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <br />
            <Divider />

            <p><b>Categories</b></p>
            <Stack>
              {this.state.budget?.categories ? this.state.budget?.categories.map((cat, i) => {
                return (

                  <>
                    <p><b>category name</b></p>

                    <TextField id="outlined-basic" variant="outlined" value={cat.name} />
                    <p><b>category value</b></p>

                    <TextField id="outlined-basic" variant="outlined" value={cat.value} />
                    <p><b>category type</b></p>

                    <TextField id="outlined-basic" variant="outlined" value={cat.type} />
                    <br />
                    <Divider />


                    {
                      i === (this.state.budget!.categories!.length - 1) ? <><br /><Button onClick={this.handleAddCategory} variant="contained">add category +</Button></> : <></>
                    }
                  </>


                )

              }) : <></>}
            </Stack>
            <Button id={this.state.budget?.getKey()} onClick={this.handleSave} variant="contained">Save</Button>

          </Stack>
        </Container>

      </div>
    );
  }
}

export default BudgetDetailView;