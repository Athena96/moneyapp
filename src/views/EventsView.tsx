import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createEvent, deleteEvent } from '../graphql/mutations'
import { listEvents } from '../graphql/queries'
import { ListEventsQuery } from "../API";
import awsExports from "../aws-exports";

import { Event } from '../model/Event';
import { Category } from '../model/Category';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from "react-router-dom";

Amplify.configure(awsExports);

interface EventsViewProps {
  value: number;
  index: number;
}

interface IState {
  name: string,
  events: Event[]
}

class EventsView extends React.Component<EventsViewProps, IState> {

  constructor(props: EventsViewProps) {
    super(props);
    this.state = {
      name: 'EventsView',
      events: []
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.handleDeleteEvents = this.handleDeleteEvents.bind(this);
    this.handleAddEvents = this.handleAddEvents.bind(this);
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    this.fetchEvents();
  }

  async fetchEvents() {
    let fetchedEvents: Event[] = [];
    try {
      const response = (await API.graphql({
        query: listEvents
      })) as { data: ListEventsQuery }
      for (const event of response.data.listEvents!.items!) {
        const cc = event?.category ? new Category(event.category!.id!, event!.category!.name!, event!.category!.value!, event!.category!.type!) : null;
        const e = new Event(event!.id!, event!.name!, new Date(event!.date!), event!.account!, cc);
        e.printEvent();
        fetchedEvents.push(e);
      }
      this.setState({ events: fetchedEvents })
    } catch (error) {
      console.log(error);
    }
  }

  async handleAddEvents() {


    try {
      let newEvent = new Event(new Date().getTime().toString(), '...', new Date(), '...', null);
      let newEvents = [...this.state.events, newEvent]
      this.setState({ events: newEvents });
      await API.graphql(graphqlOperation(createEvent, { input: newEvent }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }



  async handleDeleteEvents(event: any) {
    const idToDelete = (event.target as Element).id;
    console.log(`idToDelete: ${idToDelete}`)
    let newEvents = [];
    let eventToDelete = null;

    for (const event of this.state.events) {
      if (event.getKey() === idToDelete) {
        eventToDelete = {
          'id': event.getKey()
        }
        console.log(event.printEvent());
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

  handleEditEvents(event: any) {
    const idToEdit = (event.target as Element).id;
    console.log(idToEdit);
  }

  render() {
    return this.props.index === this.props.value ? (
      <div >
        <Button style={{ margin: '15px', width: "100%" }} onClick={this.handleAddEvents} variant="outlined">Add Event</Button>

        {this.state.events.map((event: Event) => {
          return (


            <Card variant="outlined" style={{ margin: '15px' }}>
              <CardContent>

                <Stack direction='row' spacing={4}>
                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    {event.name === "" ? '...' : event.name}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    {(event.date.getMonth() + 1).toString()}/{event.date.getFullYear().toString()}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    {event.category ? event.category!.getValue().toString() : '...'}
                  </Typography>

                </Stack>
                <CardActions>

                  <Stack direction='row' spacing={4}>
                    <Link to={`/events/${event.getKey()}`}><Button id={event.getKey()} onClick={this.handleEditEvents} variant="outlined">Edit</Button></Link>

                    <Button id={event.getKey()} onClick={this.handleDeleteEvents} variant="contained">Delete</Button>

                  </Stack>
                </CardActions>

              </CardContent>
            </Card>


          )
        })}
      </div>
    ) : (<></>);
  }

}

export default EventsView;
