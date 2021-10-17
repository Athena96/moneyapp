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
      account: "",
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
      let newEvent = new Event(this.state.id, this.state.name, this.state.date, this.state.account, new Category(this.state.id, this.state.categoryName, this.state.categoryValue, this.state.categoryType));
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
        categoryType: e!.category?.type || CategoryTypes.Expense
      });
    } catch (err) {
      console.log('error:', err)
    }

  }


  render() {
    return (
      <div>
        <Container sx={{ marginTop: '55px' }} maxWidth="sm">
          <h2><b>Event</b></h2>

          <Stack spacing={2}>

            <TextField label="Name" id="outlined-basic" name="name" variant="outlined" onChange={this.handleChange} value={this.state.name ? this.state.name : '...'} />

            <TextField label="Account" id="outlined-basic" name="account" variant="outlined" onChange={this.handleChange} value={this.state.account} />

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

            <TextField label="Category Type" id="outlined-basic" name="categoryType" variant="outlined" onChange={this.handleChange} value={this.state.categoryType} />

            <Button id={this.state.id!} onClick={this.handleSave} variant="contained">Save</Button>

          </Stack>
        </Container>

      </div>
    );
  }
}

export default EventDetailView;