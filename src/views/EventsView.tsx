import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createEvent, deleteEvent } from '../graphql/mutations'
import awsExports from "../aws-exports";
import { Event } from '../model/Base/Event';

import { Simulation } from '../model/Base/Simulation';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";
import { cleanNumberDataInput, getFinnhubClient } from '../utilities/helpers';

import { Link } from "react-router-dom";
import { CategoryTypes } from '../API';
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { EventDataAccess } from '../utilities/EventDataAccess';
import { EventFactory } from '../model/FactoryMethods/EventFactory';
import { dateRange, getObjectWithId } from '../utilities/helpers';
import { Category } from '../model/Base/Category';
import { Auth } from 'aws-amplify';

Amplify.configure(awsExports);

interface EventsViewProps {
  value: number;
  index: number;
}

interface IState {
  name: string,
  events: Event[],
  bulkAddEventName: string,
  bulkAddEventValue: number,
  bulkAddAccount: string
  bulkAddEventCatType: CategoryTypes,
  bulkAddStartDate: Date,
  bulkAddEndDate: Date,
  selectedSimulation: Simulation | null,
  isBulkAddingEvents: boolean,
  finnhubClient: any
}

class EventsView extends React.Component<EventsViewProps, IState> {

  constructor(props: EventsViewProps) {
    super(props);
    const finnhubClient = getFinnhubClient();
    this.state = {
      name: 'EventsView',
      events: [],
      bulkAddEventName: "",
      bulkAddEventValue: 0.0,
      bulkAddAccount: "brokerage",
      bulkAddEventCatType: CategoryTypes.Expense,
      bulkAddStartDate: new Date(),
      bulkAddEndDate: new Date(),
      selectedSimulation: null,
      isBulkAddingEvents: false,
      finnhubClient: finnhubClient
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDeleteEvents = this.handleDeleteEvents.bind(this);
    this.handleDuplicateEvent = this.handleDuplicateEvent.bind(this);
    this.handleAddEvents = this.handleAddEvents.bind(this);
    this.handleBulkAddEvents = this.handleBulkAddEvents.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  async componentDidMount() {

    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes.email;
    const selectedSim = await SimulationDataAccess.fetchSelectedSimulationForUser(this, email);
    await EventDataAccess.fetchEventsForSelectedSim(this, selectedSim.getKey());
  }

  async addEvent(id: string, name: string, date: Date, account: string, category: Category | null) {
    try {
      let newEvent: any = new Event(id, name, date, account, category);
      newEvent['simulation'] = this.state.selectedSimulation!.id;

      let newEvents = [...this.state.events, newEvent]
      this.setState({ events: newEvents });

      await API.graphql(graphqlOperation(createEvent, { input: newEvent }));

    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async handleAddEvents() {
    await this.addEvent(new Date().getTime().toString(), '...', new Date(), 'brokerage', null);
  }

  async handleBulkAddEvents() {
    this.setState({ isBulkAddingEvents: true });
    // start date
    // end date
    // for date from start to end
    // create event
    try {
      const dates = dateRange(this.state.bulkAddStartDate, this.state.bulkAddEndDate);
      let i = 0
      for (const eventDate of dates) {
        const key = (Math.floor(eventDate.getTime() + Math.random())).toString();
        const cat = new Category(String(++i), this.state.bulkAddEventName, this.state.bulkAddEventValue, this.state.bulkAddEventCatType);
        await this.addEvent(key, this.state.bulkAddEventName, eventDate, this.state.bulkAddAccount, cat);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ isBulkAddingEvents: false });
    }
  }

  async handleDuplicateEvent(event: any) {
    const idToDuplicate = (event.target as Element).id;
    const eventToDuplicate = getObjectWithId(idToDuplicate, this.state.events)! as Event;
    try {
      let newEvent: any = EventFactory.fromEvent(eventToDuplicate);
      newEvent['simulation'] = this.state.selectedSimulation!.id;

      let newEvents = [...this.state.events, newEvent]
      this.setState({ events: newEvents });
      await API.graphql(graphqlOperation(createEvent, { input: newEvent }))
    } catch (err) {
      console.log('error creating event:', err)
    }
  }

  async handleDeleteEvents(event: any) {
    const idToDelete = (event.target as Element).id;
    if (window.confirm('Are you sure you want to DELETE this Event?')) {

      let newEvents = [];
      let eventToDelete = null;

      for (const event of this.state.events) {
        if (event.getKey() === idToDelete) {
          eventToDelete = {
            'id': event.getKey()
          }
          continue;
        }
        newEvents.push(event);
      }
      this.setState({ events: newEvents });
      try {
        await API.graphql({ query: deleteEvent, variables: { input: eventToDelete } });
      } catch (err) {
        console.log('error:', err)
      }
    }
  }

  handleEditEvents(event: any) {
    const idToEdit = (event.target as Element).id;
    console.log(idToEdit);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    if (name === 'bulkAddEventValue') {
      this.setState({ [name]: cleanNumberDataInput(value) } as any);
    } else {
      this.setState({ [name]: value } as any);
    }
  }
  handleDropChange = (event: SelectChangeEvent) => {
    const accnt = event.target.value as string;
    this.setState({ 'bulkAddAccount': accnt } as any);
  };

  handleCategoryTypeChange = (event: SelectChangeEvent) => {
    const catType = event.target.value as string;
    const tp = catType === 'Expense' ? CategoryTypes.Expense : CategoryTypes.Income;
    this.setState({ 'bulkAddEventCatType': tp });
  };

  render() {
    return this.props.index === this.props.value ? (
      <>
        <Button style={{ width: "100%" }} onClick={this.handleAddEvents} variant="outlined">Add Event</Button>
        <br />
        <br />
        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Bulk Add Events</Typography>
          </AccordionSummary>
          {this.state.isBulkAddingEvents ? <><LoadingButton loading style={{ width: "100%" }} onClick={this.handleBulkAddEvents} variant="outlined">Bulk Add Event</LoadingButton></> : <><LoadingButton style={{ width: "100%" }} onClick={this.handleBulkAddEvents} variant="outlined">Bulk Add Event</LoadingButton></>}

          <br />
          <br />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="start date"
              value={this.state.bulkAddStartDate}
              onChange={(newValue) => {
                this.setState({ bulkAddStartDate: newValue } as any);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <br />
          <br />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="end date"
              value={this.state.bulkAddEndDate}
              onChange={(newValue) => {
                this.setState({ bulkAddEndDate: newValue } as any);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Account</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.bulkAddAccount}
              label="Account"
              onChange={this.handleDropChange}
            >
              <MenuItem value={'brokerage'}>Brokerage</MenuItem>
              <MenuItem value={'tax'}>Tax</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />

          <TextField label="Name" id="outlined-basic" name="bulkAddEventName" variant="outlined" onChange={this.handleChange} value={this.state.bulkAddEventName ? this.state.bulkAddEventName : '...'} />
          <br />
          <br />
          <TextField label="Category Value" id="outlined-basic" name="bulkAddEventValue" variant="outlined" onChange={this.handleChange} value={this.state.bulkAddEventValue} />
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.bulkAddEventCatType}
              label="Category Type"
              onChange={this.handleCategoryTypeChange}
            >
              <MenuItem value={'Expense'}>Expense</MenuItem>
              <MenuItem value={'Income'}>Income</MenuItem>
            </Select>
          </FormControl>
        </Accordion >


        <br />
        <br />

        <Stack
          direction='row' spacing={2}

        >
          <Box
            sx={{
              width: 25,
              height: 25,
              bgcolor: '#ffcdd2',
            }}
          />
          <p>Expense</p>
          <Box
            sx={{
              width: 25,
              height: 25,
              bgcolor: '#b2dfdb',
            }}
          /><p>Income</p>
        </Stack>

        <br />


        {this.state.events.length > 0 && this.state.events.sort((a, b) => (a.date > b.date) ? 1 : -1).map((event: Event) => {
          // if (event.account !== 'brokerage') return (<></>)
          return (
            <Card variant="outlined" style={{ backgroundColor: ((event.category != null && event.category!.type! === CategoryTypes.Expense) ? '#ffcdd2' : '#b2dfdb'), marginTop: '15px', width: '100%' }}>
              <CardContent>

                <Stack direction='row' spacing={4}>
                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>name: </b> {event.name === "" ? '...' : event.name}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>account: </b> {event.account}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    <b>date: </b>{(event.date.getMonth() + 1).toString()}/{event.date.getFullYear().toString()}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    ${event.category ? event.category!.getValue().toString() : '...'}
                  </Typography>

                </Stack>
                <CardActions>

                  <Stack direction='row' spacing={4}>

                    <Button id={event.getKey()} onClick={this.handleDeleteEvents} variant="outlined">Delete</Button>
                    <Button id={event.getKey()} onClick={this.handleDuplicateEvent} variant="contained">Duplicate</Button>
                    <Link style={{ color: 'white', textDecoration: 'none' }} to={`/events/${event.getKey()}`}><Button id={event.getKey()} onClick={this.handleEditEvents} variant="contained">Edit</Button></Link>

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

export default EventsView;
