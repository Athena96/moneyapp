import * as React from 'react';

import { Event } from '../../model/Base/Event';
import EventDialogView from '../EventDialogView';
import { Simulation } from '../../model/Base/Simulation';
import { EventDataAccess } from '../../utilities/EventDataAccess';

interface EventDetailProps {
  user: string;
  simulation: Simulation | undefined;
}

interface IState {
  event: Event | undefined;
}

class EventDetailView extends React.Component<EventDetailProps, IState> {
  constructor(props: EventDetailProps) {
    super(props);
    this.state = {
      event: undefined
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    const eventId = window.location.pathname.split('/')[2];
    const eventToEdit = await EventDataAccess.getEvent(eventId);
    this.setState({ event: eventToEdit });
  }

  render() {
    return (
      <div>
          { this.props.simulation && this.state.event && <EventDialogView user={this.props.user} simulation={this.props.simulation} event={this.state.event} type={this.state.event.type} /> }
      </div>
    );
  }
}

export default EventDetailView;