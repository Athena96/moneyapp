import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import '../App.css';
import { Event } from '../model/Event';
import { Budget } from '../model/Budget';
import { Account } from '../model/Account';

import { getEvents, getBudgets, getAccounts } from '../utilities/dataSetup';
import { generateTable } from '../utilities/helpers';
import { Line } from "react-chartjs-2";
import AccountsView from '../views/AccountsView';
import BudgetsView from '../views/BudgetsView';
import DataView from '../views/DataView';
import InputsView from '../views/InputsView';
import EventsView from '../views/EventsView';
import GraphView from '../views/GraphView';

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
          <div>
            <GraphView />
          </div>

          <br/><br />

          <div>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile value={this.state.selectedTab} onChange={this.handleChange} aria-label="basic tabs example" centered>
                  <Tab label="Data" />
                  <Tab label="Budgets" />
                  <Tab label="Events" />

                  <Tab label="Accounts" />
                  <Tab label="Inputs" />
                </Tabs>
              </Box>
              <br /><br />
              <DataView value={this.state.selectedTab} index={0} />
              <BudgetsView value={this.state.selectedTab} index={1} />
              <EventsView value={this.state.selectedTab} index={2} />

              <AccountsView value={this.state.selectedTab} index={3} />
              <InputsView value={this.state.selectedTab} index={4} />
            </Box>
          </div>
        </div>
      </div>

    );
  }
}

export default Home;