import * as React from 'react';

// import React from "react";
import { Amplify } from "aws-amplify";
import {
  AmplifyProvider,
  Authenticator,
  Flex,
  Image,
  Text,
  View,
} from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import theme from "./theme";
import logo from "./logo.svg";




import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { Link } from "react-router-dom";

import './App.css';
import { Auth } from 'aws-amplify';

import Main from './views/Main'
import { moneyGreen } from './utilities/constants';
import aws_exports from "./aws-exports";

Amplify.configure(aws_exports);

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
      
        <div style={{textAlign: 'left'}}>

          <Typography variant="h2" component="div" gutterBottom>
            Money<br/>Tomorrow
          </Typography>
        </div>
        <div style={{textAlign: 'left'}}>

        <AmplifyProvider theme={theme}>
          <Authenticator >
            {({ signOut, user }) => (
              <>

           
                <Box sx={{ flexGrow: 1 }}>
                  <AppBar sx={{ bgcolor: moneyGreen }} position="static">
                    <Toolbar>

                      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      <Link style={{ color: 'white', textDecoration: 'none' }} to="/">Money Tomorrow {<small>{user && user.attributes && user.attributes.email ? user.attributes.email : ''}</small>}</Link>
                      </Typography>
                      <Button variant="outlined" style={{ color: 'white'}} onClick={signOut}>
                        Sign Out
                      </Button>
                    </Toolbar>
                  </AppBar>
                </Box>

                <Container >
                  <Main />
                </Container>
              </>

            )}
          </Authenticator>
        </AmplifyProvider>
        </div>

      </div>
    );
  }
}

export default App;
