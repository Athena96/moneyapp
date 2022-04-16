import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { Link } from "react-router-dom";

import './App.css';

import Main from './views/Main'
import { moneyGreen } from './utilities/constants';

interface IProps {
}

interface IState {
  selectedTab: number;

}

class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {

    super(props);
    this.state = {
      selectedTab: 2
    }

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  render() {

    return (
      <div>

        <Box sx={{ flexGrow: 1 }}>
          <AppBar sx={{ bgcolor: moneyGreen }} position="static">
            <Toolbar>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link style={{ color: 'white', textDecoration: 'none' }} to="/">Money Tomorrow</Link>
              </Typography>

            </Toolbar>
          </AppBar>
        </Box>

        <Container >
          <Main />
        </Container>
      </div>
    );
  }
}

export default App;
