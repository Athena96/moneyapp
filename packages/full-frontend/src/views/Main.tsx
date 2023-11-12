
import * as React from 'react';

import AssetsView from './Assets/AssetsView';
import { Switch, Route } from 'react-router-dom';
import DashboardView from './Dashboard/DashboardView';
import WithdrawalsView from './Withdrawals/WithdrawalsView';
import IncomesView from './Incomes/IncomesView';
import SettingsView from './Settings/SettingsView';

interface InputsViewProps {
  user: string;
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

  componentDidMount(): void {
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" render={(props) => <DashboardView user={this.props.user} scenarioId={"s1"} />} />
        <Route path="/withdrawals" render={(props) => <WithdrawalsView user={this.props.user} scenarioId={"s1"} />} />
        <Route path="/contributions" render={(props) => <IncomesView user={this.props.user} scenarioId={"s1"} />} />
        <Route path="/assets" render={(props) => <AssetsView user={this.props.user} scenarioId={"s1"} />} />
        <Route path="/settings" render={(props) => <SettingsView user={this.props.user} scenarioId={"s1"} />} />
      </Switch>
    );
  }
}

export default Main;
