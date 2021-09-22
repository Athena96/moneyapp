import * as React from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';

// import '../App.css';
// import { Event } from '../model/Event';
import { Event } from '../model/Event';
import { Category, CategoryTypes } from '../model/Category';
// import { CategoryTypes } from '../model/Category';

// import { getEvents, getEvents } from '../utilities/dataSetup';
// import { dateRange, generateTable } from '../utilities/helpers';
// import { Line } from "react-chartjs-2";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getEvents } from '../utilities/dataSetup';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import TextField from '@mui/material/TextField';
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
      events: getEvents()
    }
    this.handleDeleteEvents = this.handleDeleteEvents.bind(this);
    this.handleAddEvents = this.handleAddEvents.bind(this);
    this.render = this.render.bind(this);
  }

  handleAddEvents() {
    let newEvent = new Event('...', new Date(), '...', new Category('...', 0.0, CategoryTypes.Expense, null));
    let newEvents = [...this.state.events, newEvent]
    this.setState({ events: newEvents });
  }

  handleDeleteEvents(event: any) {
    const idToDelete = (event.target as Element).id;
    let newEvents = [];
    for (const event of this.state.events) {
      if (event.getKey() !== idToDelete) {
        newEvents.push(event);
      }
    }
    this.setState({ events: newEvents });
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

                <Button id={event.date.getTime().toString()} onClick={this.handleDeleteEvents} variant="contained">Delete Event</Button>

              </Stack>
            </CardContent>
          </Card>


              )
          })}
      </div>
    ) : (<></>);
  }

}

export default EventsView;
