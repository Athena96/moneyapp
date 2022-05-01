import * as React from 'react';
import '../App.css';
import BudgetsView from '../views/BudgetsView';
import DataView from '../views/DataView';
import EventsView from '../views/EventsView';
import GraphView from '../views/GraphView';
import AssetsView from '../views/AssetsView';
import SimulationView from '../views/SimulationView';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify'
import awsExports from "../aws-exports";
import { Simulation } from '../model/Base/Simulation';
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';

Amplify.configure(awsExports);

interface IProps {
}

interface IState {
  selectedTab: number;
  user: string | undefined;
  simulation: Simulation | undefined;
}

class Home extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedTab: 1,
      user: undefined,
      simulation: undefined
    }

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.newTab = this.newTab.bind(this);
  }

  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser();
    console.log('user ' + JSON.stringify(user.attributes))
    const email: string = user.attributes.email;
    const userSim = await SimulationDataAccess.fetchSelectedSimulationForUser(this, email);

    this.setState({ user: email, simulation: userSim});
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }
  newTab(newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  render() {
    if (this.state.user ) {
      return (
        <div >
          <div >
            <Box sx={{ width: '100%' }}>
              <GraphView user={this.state.user} simulation={this.state.simulation} />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile value={this.state.selectedTab} onChange={this.handleChange} aria-label="basic tabs example" centered>
                  {/* <Tab label="Accounts" /> */}
                  <Tab label="Data" />
                  <Tab label="Budgets" />
                  <Tab label="Events" />
                  {/* <Tab label="Inputs" /> */}
                  <Tab label="Assets" />
                  <Tab label="Life Scenarios" />
                </Tabs>
              </Box>
              <br /><br />
              {/* <AccountsView value={this.state.selectedTab} index={0} /> */}
              <DataView value={this.state.selectedTab} index={0} user={this.state.user} simulation={this.state.simulation} change={this.newTab}/>
              <BudgetsView value={this.state.selectedTab} index={1} user={this.state.user} simulation={this.state.simulation} change={this.newTab}/>
              <EventsView value={this.state.selectedTab} index={2} user={this.state.user} simulation={this.state.simulation} change={this.newTab}/>
              {/* <InputsView value={this.state.selectedTab} index={3} /> */}
              <AssetsView value={this.state.selectedTab} index={3} user={this.state.user} simulation={this.state.simulation} change={this.newTab}/>
              <SimulationView value={this.state.selectedTab} index={4} user={this.state.user} simulation={this.state.simulation} />
            </Box>
          </div>
        </div>
      );
    } else {
      return(<></>)
    }
  }
}

export default Home;
