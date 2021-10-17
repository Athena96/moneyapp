import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { getBudget } from '../../graphql/queries'
import awsExports from "../../aws-exports";
import { CategoryTypes, GetBudgetQuery } from "../../API";

import { Budget } from '../../model/Base/Budget';
import { Category } from '../../model/Base/Category';

import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { updateBudget } from '../../graphql/mutations';
import { cleanNumberDataInput } from '../../utilities/helpers';

Amplify.configure(awsExports);

interface BudgetDetailProps {
}


interface IState {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  categories: Category[] | null;
}

class BudgetDetailView extends React.Component<BudgetDetailProps, IState> {
  constructor(props: BudgetDetailProps) {
    super(props);
    this.state = {
      id: "",
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      categories: []

    }

    this.handleChange = this.handleChange.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.fetchBudget = this.fetchBudget.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {

    this.fetchBudget(window.location.pathname.split('/')[2])
  }

  async handleSave() {
    try {
      let newBudget = new Budget(this.state.id, this.state.name, this.state.startDate, this.state.endDate, this.state.categories!);

      await API.graphql(graphqlOperation(updateBudget, { input: newBudget }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    console.log(`${name} = ${value}`)
    if (name.includes('category')) {
      const cats = this.state.categories!
      // ${cat.id}-category-name
      const parts = name.split('-');
      const id = parts[0];
      const catname = parts[2]
      for (const c of cats) {
        if (id === c.id) {
          if (name.includes("category-value")) {
            (c as any)[catname] = cleanNumberDataInput(value);
          } else {
           
          (c as any)[catname] = value; 
          }
        }
      }

      this.setState({ categories: cats });

    } else {

      this.setState({ [name]: value } as any);
    }
  }

  handleAddCategory() {

    let currCategories: Category[] = [];

    if (this.state.categories) {
      currCategories = this.state.categories!;
    }

    currCategories.push(new Category(new Date().getTime().toString(), '', 0, CategoryTypes.Expense));

    this.setState({
      categories: currCategories
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

      this.setState({
        id: e!.id!,
        name: e!.name!,
        startDate: new Date(e!.startDate!),
        endDate: new Date(e!.endDate!),
        categories: cats
      });
    } catch (err) {
      console.log('error:', err)
    }

  }

  handleDeleteCategory(e: any) {
    const target = e.target;
    const catId = target.id;
    let newListOfCategories = []
    if (this.state.categories != null) {
      for (const c of this.state.categories!) {

        if (c.getKey() !== catId) {
          newListOfCategories.push(c);
        }
      }
      this.setState({ categories: newListOfCategories });
    }
  }

  render() {
    return (
      <div>
        <Container sx={{ marginTop: '55px' }} maxWidth="sm">
          <h2><b>Budget</b></h2>
          <Stack spacing={2}>
            <TextField label="Name" id="outlined-basic" name={`name`} variant="outlined" onChange={this.handleChange} value={this.state.name} />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={this.state.startDate}
                onChange={(newValue) => {
                  this.setState({ startDate: newValue } as any);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={this.state.endDate}
                onChange={(newValue) => {
                  this.setState({ endDate: newValue } as any);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <br />
            <Divider />

            <p><b>Categories</b></p>
            <Stack spacing={2}>
              {this.state.categories ? this.state.categories.map((cat, i) => {
                return (

                  <>
                    <TextField label="Category Name" id="outlined-basic" name={`${cat.id}-category-name`} variant="outlined" onChange={this.handleChange} value={cat.name} />
                    <TextField label="Category Value" id="outlined-basic" name={`${cat.id}-category-value`} variant="outlined" onChange={this.handleChange} value={cat.value} />
                    <TextField label="Category Type" id="outlined-basic" name={`${cat.id}-category-type`} variant="outlined" onChange={this.handleChange} value={cat.type} />


                    <Button id={cat.id} onClick={this.handleDeleteCategory} variant="contained">delete category</Button>

                    <br />
                    <Divider />


                    {
                      i === (this.state.categories!.length - 1) ? <><br /><Button onClick={this.handleAddCategory} variant="contained">add category +</Button></> : <></>
                    }
                  </>


                )

              }) : <><br /><Button onClick={this.handleAddCategory} variant="contained">add category +</Button></>}
            </Stack>
            <Button id={this.state.id} onClick={this.handleSave} variant="contained">Save</Button>

          </Stack>
        </Container>

      </div>
    );
  }
}

export default BudgetDetailView;