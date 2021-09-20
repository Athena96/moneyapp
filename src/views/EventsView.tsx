import * as React from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';

// import '../App.css';
// import { Event } from '../model/Event';
import { Event } from '../model/Event';
import { Category } from '../model/Category';
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

    this.render = this.render.bind(this);
  }

  render() {
    return this.props.index === this.props.value ? (
      <div >
        <Button style={{margin: '15px'}} variant="outlined">Add Event</Button>

          {this.state.events.map((event: Event) => {
              return (

                <Card variant="outlined" style={{margin: '15px' }} sx={{  minWidth: 275}}>
                <CardContent>

                <Stack spacing={2} direction="row">
                    <TextField id="outlined-basic" label={event.name} placeholder={event.name} variant="outlined" />
                    <TextField id="outlined-basic" label={event.date.toString()} placeholder={event.date.toString()} variant="outlined" />
                    <TextField id="outlined-basic" label={event.category ? event.category!.getValue().toString() : '...'} placeholder={event.category ? event.category!.getValue().toString() : '...'} variant="outlined" />
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
