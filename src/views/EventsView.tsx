import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createEvent, deleteEvent } from '../graphql/mutations'
import awsExports from "../aws-exports";

import { Event } from '../model/Event';
import { fetchEvents } from '../utilities/helpers';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from "react-router-dom";
import { CategoryTypes } from '../API';

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
    this.handleDeleteEvents = this.handleDeleteEvents.bind(this);
    this.handleAddEvents = this.handleAddEvents.bind(this);
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    fetchEvents(this);
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
      <>
        <Button style={{ width: "100%" }} onClick={this.handleAddEvents} variant="outlined">Add Event</Button>

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
