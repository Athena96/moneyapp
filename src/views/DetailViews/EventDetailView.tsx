import * as React from 'react';



import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createEvent, deleteEvent } from '../../graphql/mutations'
import { getEvent, listEvents } from '../../graphql/queries'
import { GetEventQuery, ListEventsQuery, OnCreateEventSubscription } from "../../API";
import { Event } from '../../model/Event';
import { GraphQLResult } from "@aws-amplify/api";
// import {
//   BrowserRouter as Router,
//   Link,
//   Route
// } from 'react-router-dom'
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';

import awsExports from "../../aws-exports";
import { getEvents } from '../../utilities/dataSetup';
import { Category } from '../../model/Category';


import Button from '@mui/material/Button';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

Amplify.configure(awsExports);

interface EventDetailProps {
}


interface IState {
  event: Event | null;
}
class EventDetailView extends React.Component<EventDetailProps, IState> {
  constructor(props: EventDetailProps) {
    super(props);
    this.state = {
      event: null
    }

    this.handleSave = this.handleSave.bind(this);
    this.fetchEvent = this.fetchEvent.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {

    this.fetchEvent(window.location.pathname.split('/')[2])
  }

  handleSave() {

  }

  async fetchEvent(eventId: string) {

    console.log(eventId);
    try {
      const ee = await API.graphql({ query: getEvent, variables: { id: eventId } }) as { data: GetEventQuery }
      const e = ee.data!.getEvent!;
      const event = new Event(e!.id!, e!.name!, new Date(e!.date!), e!.account!, e!.category ? new Category(e!.category!.id!, e!.category!.name!, e!.category!.value!, e!.category!.type!) : null)
      console.log(event.toStringEvent());

      this.setState({ event: event });
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
            <TextField id="outlined-basic" variant="outlined" value={this.state.event?.name ? this.state.event?.name : '...'} />
            <p><b>account</b></p>
            <TextField id="outlined-basic" variant="outlined" value={this.state.event?.account} />
            <p><b>date</b></p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Basic example"
                value={this.state.event?.date}
                onChange={(newValue) => {
                  // setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <p><b>category name</b></p>

            <TextField id="outlined-basic" variant="outlined" value={this.state.event?.category?.name} />
            <p><b>category value</b></p>

            <TextField id="outlined-basic" variant="outlined" value={this.state.event?.category?.value} />
            <p><b>category type</b></p>

            <TextField id="outlined-basic" variant="outlined" value={this.state.event?.category?.type} />

            <Button id={this.state.event?.getKey()} onClick={this.handleSave} variant="contained">Save</Button>

          </Stack>
        </Container>

      </div>
    );
  }
}

export default EventDetailView;