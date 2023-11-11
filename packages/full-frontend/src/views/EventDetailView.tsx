// import * as React from 'react';

// import { OneTime } from '../model/Base/OneTime';
// import OneTimeDialogView from './SharedViews/OneTimeDialogView';
// import { Simulation } from '../model/Base/Simulation';
// import { OneTimeDataAccess } from '../utilities/OneTimeDataAccess';

// interface OneTimeDetailProps {
//   user: string;
//   simulation: Simulation | undefined;
// }

// interface IState {
//   event: OneTime | undefined;
// }

// class OneTimeDetailView extends React.Component<OneTimeDetailProps, IState> {
//   constructor(props: OneTimeDetailProps) {
//     super(props);
//     this.state = {
//       event: undefined
//     }
//     this.componentDidMount = this.componentDidMount.bind(this);
//   }

//   async componentDidMount() {
//     const eventId = window.location.pathname.split('/')[2];
//     const eventToEdit = await OneTimeDataAccess.getOneTime(eventId);
//     this.setState({ event: eventToEdit });
//   }

//   render() {
//     return (
//       <div>
//           { this.props.simulation && 
//           this.state.event && 
//           <OneTimeDialogView user={this.props.user} simulation={this.props.simulation} event={this.state.event} type={this.state.event.type} /> }
//       </div>
//     );
//   }
// }

// export default OneTimeDetailView;
import React from "react";

export class OneTimeDetailView extends React.Component {
    render() {
        return (<></>)
    }
}