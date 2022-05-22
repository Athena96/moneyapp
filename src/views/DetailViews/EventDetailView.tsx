import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { getEvent } from '../../graphql/queries'
import { CategoryTypes, GetEventQuery } from "../../API";
import awsExports from "../../aws-exports";

import { Event } from '../../model/Base/Event';
import { Category } from '../../model/Base/Category';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { updateEvent } from '../../graphql/mutations';
import { cleanNumberDataInput } from '../../utilities/helpers';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

Amplify.configure(awsExports);

interface EventDetailProps {
}

interface IState {
  id: string;
  name: string;
  date: Date;
  account: string;
  categoryName: string;
  categoryValue: number;
  categoryType: CategoryTypes;
}

class EventDetailView extends React.Component<EventDetailProps, IState> {
  constructor(props: EventDetailProps) {
    super(props);
    this.state = {
      id: "",
      name: "",
      date: new Date(),
      account: "brokerage",
      categoryName: "",
      categoryValue: 0.0,
      categoryType: CategoryTypes.Expense
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.fetchEvent = this.fetchEvent.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.fetchEvent(window.location.pathname.split('/')[2])
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    if (name === 'categoryValue') {
      this.setState({ [name]: cleanNumberDataInput(value) } as any);
    } else {
      this.setState({ [name]: value } as any);
    }
  }

  async handleSave() {
    try {
      let newEvent = new Event(this.state.id, this.state.name, this.state.date, this.state.account, new Category(this.state.id, this.state.categoryName, this.state.categoryValue), this.state.categoryType);
      await API.graphql(graphqlOperation(updateEvent, { input: newEvent }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async fetchEvent(eventId: string) {
    try {
      const ee = await API.graphql({ query: getEvent, variables: { id: eventId } }) as { data: GetEventQuery }
      const e = ee.data!.getEvent!;
      this.setState({
        id: e!.id!,
        name: e!.name!,
        date: new Date(e!.date!),
        account: e!.account!,
        categoryName: e!.category?.name || "",
        categoryValue: e!.category?.value || 0.0,
        categoryType: e?.type || CategoryTypes.Expense
      });
    } catch (err) {
      console.log('error:', err)
    }

  }
  handleDropChange = (event: SelectChangeEvent) => {
    const accnt = event.target.value as string;
    this.setState({ 'account': accnt } as any);
  };


  handleCategoryTypeChange = (event: SelectChangeEvent) => {
    const catType = event.target.value as string;
    const tp = catType === 'Expense' ? CategoryTypes.Expense : CategoryTypes.Income;
    this.setState({ 'categoryType': tp });
  };

  render() {
    return (
      <div>
        <Container sx={{ marginTop: '55px' }} maxWidth="sm">
          <h2><b>Event</b></h2>

          <Stack spacing={2}>

            <TextField label="Name" id="outlined-basic" name="name" variant="outlined" onChange={this.handleChange} value={this.state.name ? this.state.name : '...'} />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Account</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.account}
                label="Account"
                onChange={this.handleDropChange}
              >
                <MenuItem value={'brokerage'}>Brokerage</MenuItem>
                <MenuItem value={'tax'}>Tax</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="date"
                value={this.state.date}
                onChange={(newValue) => {
                  this.setState({ date: newValue } as any);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>


            <TextField label="Category Name" id="outlined-basic" name="categoryName" variant="outlined" onChange={this.handleChange} value={this.state.categoryName} />

            <TextField label="Category Value" id="outlined-basic" name="categoryValue" variant="outlined" onChange={this.handleChange} value={this.state.categoryValue} />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.categoryType}
                label="Category Type"
                onChange={this.handleCategoryTypeChange}
              >
                <MenuItem value={'Expense'}>Expense</MenuItem>
                <MenuItem value={'Income'}>Income</MenuItem>
              </Select>
            </FormControl>
            <Button id={this.state.id!} onClick={this.handleSave} variant="contained">Save</Button>

          </Stack>
        </Container>

      </div>
    );
  }
}

export default EventDetailView;