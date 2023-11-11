
import * as React from 'react';

import AssetsView from './Assets/AssetsView';
import { Switch, Route } from 'react-router-dom';
import DashboardView from './Dashboard/DashboardView';
// import { Simulation } from '../model/Base/Simulation';
import WithdrawalsView from './Withdrawals/WithdrawalsView';
import IncomesView from './Incomes/IncomesView';
// import SetupView from './SetupView';
// import SettingsView from './Settings/SettingsView';
// import IncomesView from './Incomes/IncomesView';
// import { Input } from '../model/Base/Input';
// import OneTimeDetailView from './OneTimeDetailView';
// import LearnMoreView from './LearnMoreView';

interface InputsViewProps {
  user: string;
  // simulation: Simulation | undefined;
  // input: Input;
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
      console.log('MainView mounted');
  }

  render() {
    return (
      <Switch>
        {/* {/* <Route exact path="/" render={(props) => this.props.input && this.props.input.firstSignIn && this.props.input.firstSignIn === true ? <SetupView user={this.props.user} simulation={this.props.simulation} /> : <DashboardView user={this.props.user} simulation={this.props.simulation} />} /> */}
        <Route exact path="/" render={(props) =><DashboardView user={this.props.user} scenarioId={"s1"} />} />
        <Route path="/withdrawals" render={(props) => <WithdrawalsView user={this.props.user} scenarioId={"s1"} />} />
        <Route path="/contributions" render={(props) => <IncomesView user={this.props.user} scenarioId={"s1"}  />} />
        <Route path="/assets" render={(props) => <AssetsView user={this.props.user} scenarioId={"s1"}  />} />
        {/* <Route path="/setup" render={(props) => <SetupView user={this.props.user}  simulation={this.props.simulation} />} />
        <Route path="/settings" render={(props) => <SettingsView user={this.props.user} simulation={this.props.simulation} />} />
        <Route path="/event" render={(props) => <OneTimeDetailView user={this.props.user} simulation={this.props.simulation}/>} />
        <Route path="/about" render={(props) => <LearnMoreView />} /> */}

      </Switch>
    );
  }
}

export default Main;
