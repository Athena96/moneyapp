
import * as React from 'react';

import AccountDetailView from './DetailViews/AccountDetailView';
import BudgetDetailView from './DetailViews/BudgetDetailView';
import EventDetailView from './DetailViews/EventDetailView';
import AssetsView from './AssetsView';

import Home from './Home';

import { Switch, Route } from 'react-router-dom';
import SimulationView from './SimulationView';

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
        <Route path="/events" component={EventDetailView} />
        <Route path="/budgets" component={BudgetDetailView} />
        {/* <Route path="/accounts" component={AccountDetailView} /> */}
        <Route path="/assets" component={AssetsView} />
        <Route path="/simulations" component={SimulationView} />

      </Switch>
    );
  }

}

export default Main;
