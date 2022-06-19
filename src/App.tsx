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
import aws_exports from "./aws-exports";
import Home from './views/Home';
import { Auth } from 'aws-amplify';
import SignInView from './views/SignInView';

Amplify.configure(aws_exports);

interface IProps {
}

interface IState {
  selectedTab: number;
  signedIn: boolean;
}

class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {

    super(props);
    this.state = {
      selectedTab: 2,
      signedIn: false
    }

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideSignIn = this.hideSignIn.bind(this);
    this.hideShowSignIn = this.hideShowSignIn.bind(this);
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser();
    if (user) {
      this.setState({ signedIn: true })
    } else {
      this.setState({ signedIn: false })
    }
  }

  hideSignIn() {
    this.setState({ signedIn: true })
  }
  hideShowSignIn() {
    this.setState({ signedIn: false })
  }
  render() {
    // have a did setup in Inputs.... if hasDoneSetup, load Home, otherwise load Setup
    return (
      <div>
        <div style={{ textAlign: 'left' }}>
          {!this.state.signedIn && <SignInView />}
          <AmplifyProvider theme={theme}>
            <Authenticator >
              {({ signOut, user }) => {
                return (
                  <>
                    <Container >
                      <Home hideSignIn={this.hideSignIn} hideShowSignIn={this.hideShowSignIn} />
                    </Container>
                  </>
                )}
              }
            </Authenticator>
          </AmplifyProvider>
        </div>
      </div>
    );
  }
}

export default App;
