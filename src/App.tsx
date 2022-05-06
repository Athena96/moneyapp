import * as React from 'react';
import './App.css';

import { Amplify } from "aws-amplify";
import {
  AmplifyProvider,
  Authenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import theme from "./theme";
import Container from '@mui/material/Container';
import Main from './views/Main'
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
        <div style={{ textAlign: 'left' }}>

          <AmplifyProvider theme={theme}>
            <Authenticator >
              {({ signOut, user }) => (
                <>
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
