
import * as React from 'react';

import BudgetDetailView from './DetailViews/BudgetDetailView';
import EventDetailView from './DetailViews/EventDetailView';
import AssetsView from './AssetsView';
import { Switch, Route } from 'react-router-dom';
import SimulationView from './SimulationView';
import GraphsView from './GraphView';
import { Simulation } from '../model/Base/Simulation';
import EventsView from './EventsView';
import BudgetsView from './BudgetsView';
import DataView from './DataView';
import SetupView from './SetupView';
import AccountsView from './AccountsView';
import AccountDetailView from './DetailViews/AccountDetailView';

interface InputsViewProps {
  user: string;
  simulation: Simulation | undefined;
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
        <Route exact path="/" render={(props) => <GraphsView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/events" render={(props) => <EventsView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/budgets" render={(props) => <BudgetsView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/assets" render={(props) => <AssetsView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/accounts" render={(props) => <AccountsView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/scenarios" render={(props) => <SimulationView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/data" render={(props) => <DataView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/account" component={AccountDetailView} />
        <Route path="/event" component={EventDetailView} />
        <Route path="/budget" component={BudgetDetailView} />
        <Route path="/setup" render={(props) => <SetupView user={this.props.user} simulation={this.props.simulation} />} />

      </Switch>
    );
  }
}

export default Main;
