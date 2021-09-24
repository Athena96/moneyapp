import * as React from 'react';
interface EventDetailProps {
    path: string;
}


interface IState {
    path: string;
}
class EventDetail extends React.Component<EventDetailProps, IState> {
    constructor(props: EventDetailProps) {

        super(props);

        this.state = {
            path: props.path
        }
    }
  componentWillMount(){
    console.log(this.props.path);
  }

  render(){
    return (
      <div>
        <h3>
          This is Currency Page !
        </h3>
      </div>
    );
  }
}

export default EventDetail;