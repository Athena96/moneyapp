
import * as React from 'react';

import BudgetDetailView from './BudgetDetailView';
import EventDetailView from './EventDetailView';
import AssetsView from './Assets/AssetsView';
import { Switch, Route } from 'react-router-dom';
import SimulationView from './SimulationView';
import DashboardView from './Dashboard/DashboardView';
import { Simulation } from '../model/Base/Simulation';
import ExpensesView from './Expenses/ExpensesView';
import DataView from './Dashboard/DataView';
import SetupView from './SetupView';
import AccountsView from './Settings/AccountsView';
import AccountDetailView from './Settings/AccountDetailView';
import SettingsView from './Settings/SettingsView';
import TestView from './TestView';
import IncomesView from './Incomes/IncomesView';
import { Input } from '../model/Base/Input';

interface InputsViewProps {
  user: string;
  simulation: Simulation | undefined;
  input: Input | undefined;
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
        <Route exact path="/" render={(props) => this.props.input && this.props.input.firstSignIn && this.props.input.firstSignIn === true ? <SetupView user={this.props.user} simulation={this.props.simulation} /> : <DashboardView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/expenses" render={(props) => <ExpensesView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/incomes" render={(props) => <IncomesView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/assets" render={(props) => <AssetsView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/accounts" render={(props) => <AccountsView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/scenarios" render={(props) => <SimulationView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/data" render={(props) => <DataView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/event" render={(props) => <EventDetailView user={this.props.user} simulation={this.props.simulation}/>} />
        
        <Route path="/account" component={AccountDetailView} />
        <Route path="/budget" component={BudgetDetailView} />
        <Route path="/setup" render={(props) => <SetupView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/settings" render={(props) => <SettingsView user={this.props.user} simulation={this.props.simulation} />} />

        <Route path="/test" render={(props) => <TestView user={this.props.user} simulation={this.props.simulation} />} />

      </Switch>
    );
  }
}

export default Main;
