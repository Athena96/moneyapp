import * as React from 'react';

import BudgetsView from '../views/BudgetsView';
import DataView from '../views/DataView';
// import InputsView from '../views/InputsView';
import EventsView from '../views/EventsView';
import GraphView from '../views/GraphView';
import AssetsView from '../views/AssetsView';
import SimulationView from '../views/SimulationView';


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import '../App.css';

interface IProps {
}

interface IState {
  selectedTab: number;

}

class Home extends React.Component<IProps, IState> {

  constructor(props: IProps) {

    super(props);
    this.state = {
      selectedTab: 1
    }

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  render() {

    return (
      <div >

        <div >
          <Box sx={{ width: '100%' }}>
            <GraphView />
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

            <DataView value={this.state.selectedTab} index={0} />
            <BudgetsView value={this.state.selectedTab} index={1} />
            <EventsView value={this.state.selectedTab} index={2} />
            {/* <InputsView value={this.state.selectedTab} index={3} /> */}
            <AssetsView value={this.state.selectedTab} index={3} />
            <SimulationView value={this.state.selectedTab} index={4} />

          </Box>
        </div>
      </div>

    );
  }
}

export default Home;
