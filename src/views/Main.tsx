
import * as React from 'react';

import { Switch, Route } from 'react-router-dom';
import EventDetail from './EventDetail';


import Home from './Home';

interface InputsViewProps {

}

interface IState {
  name: string
}

class Main extends React.Component<InputsViewProps, IState> {

  constructor(props: InputsViewProps) {
  
    super(props);

    this.state = {
      name: 'MainView',
    }

    this.render = this.render.bind(this);
  }

  render() {
    return (
        <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/events" component={EventDetail} />

      </Switch>
      );
  }

}

export default Main;
