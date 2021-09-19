import * as React from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';

// import '../App.css';
// import { Event } from '../model/Event';
// import { Budget } from '../model/Budget';
// import { Account } from '../model/Account';
// import { CategoryTypes } from '../model/Category';

// import { getEvents, getBudgets } from '../utilities/dataSetup';
// import { dateRange, generateTable } from '../utilities/helpers';
// import { Line } from "react-chartjs-2";


interface BudgetsViewProps {
    value: number;
    index: number;
}

interface IState {
  name: string
}

class BudgetsView extends React.Component<BudgetsViewProps, IState> {

  constructor(props: BudgetsViewProps) {
  
    super(props);

    this.state = {
      name: 'BudgetsView',
    }

    this.render = this.render.bind(this);
  }

  render() {
    return this.props.index === this.props.value ? (
      <div >
          <h1>Budgets View</h1>
      </div>
    ) : (<></>);
  }

}

export default BudgetsView;
