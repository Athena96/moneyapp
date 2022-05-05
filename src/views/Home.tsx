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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "100%", }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

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
    const email: string = user.attributes.email;
    const userSim = await SimulationDataAccess.fetchSelectedSimulationForUser(this, email);

    this.setState({ user: email, simulation: userSim });
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }
  newTab(newValue: number) {
    this.setState({ selectedTab: newValue });
  }


  render() {


    if (this.state.user) {
      return (

        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"

            value={this.state.selectedTab}
            onChange={this.handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: `1px`, borderColor: 'divider', overflow: `visible`, }}
          >
            {/* <Tab label="Accounts" /> */}

            <Tab label="Graph" {...a11yProps(0)} />
            <Tab label="Budgets" {...a11yProps(1)} />
            <Tab label="Events" {...a11yProps(2)} />
            <Tab label="Assets" {...a11yProps(3)} />
            <Tab label="Data" {...a11yProps(4)} />
            <Tab label="Simulations" {...a11yProps(4)} />


          </Tabs>

          <TabPanel value={this.state.selectedTab} index={0} >
            <GraphView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
          </TabPanel>


          <TabPanel value={this.state.selectedTab} index={1}>
            <BudgetsView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
          </TabPanel>

          <TabPanel value={this.state.selectedTab} index={2}>
            <EventsView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
          </TabPanel>

          <TabPanel value={this.state.selectedTab} index={3}>
            <AssetsView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
          </TabPanel>

          <TabPanel value={this.state.selectedTab} index={4}>
            <DataView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
          </TabPanel>
       
          <TabPanel value={this.state.selectedTab} index={5}>
            <SimulationView user={this.state.user} simulation={this.state.simulation} />
          </TabPanel>

 

        </Box>


      );
    } else {
      return (<></>)
    }
  }
}

export default Home;
