import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './App.css';
import { Event } from './model/Event';
import { Budget } from './model/Budget';
import { Account } from './model/Account';

import { getEvents, getBudgets, getAccounts } from './utilities/dataSetup';
import { generateTable } from './utilities/helpers';
import { Line } from "react-chartjs-2";
import AccountsView from './views/AccountsView';
import BudgetsView from './views/BudgetsView';
import DataView from './views/DataView';
import InputsView from './views/InputsView';
import EventsView from './views/EventsView';
import Main from './views/Main'

interface IProps {
}

interface IState {
  selectedTab: number;

}

class App extends React.Component<IProps, IState> {

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
        <Main/>
      </div>

    );
  }
}

export default App;
