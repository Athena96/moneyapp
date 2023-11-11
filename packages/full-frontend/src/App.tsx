import * as React from 'react';
import './App.css';

import { Amplify, JS } from "aws-amplify";
import {
  AmplifyProvider,
  Authenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import theme from "./theme";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import aws_exports from "./aws-exports";
import Home from './views/Home';
import { Auth } from 'aws-amplify';
import SignInView from './views/SignInView';
import { moneyGreen } from './utilities/constants';

const isMobile = window.innerWidth <= 390;


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
    console.log('here');
    let user;
    try {
      user = await Auth.currentAuthenticatedUser();
      // console.log('user ' + JSON.stringify(user));

    } catch (e) {
      user = null;
    }
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
    console.log('this.state.signedIn ' + this.state.signedIn);

    return (
      <div>
        <div >
          {
            !this.state.signedIn ? <>
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <div style={{ textAlign: 'center', marginTop: isMobile ? '0px' : '175px', marginLeft: isMobile ? '0px' : '30px' }}>
                  
                  {isMobile && <h1 style={{ color: moneyGreen }}>Money Tomorrow</h1>}

                  <p style={{ color: moneyGreen, textAlign: 'center' }}><b>Sign in to your Account</b></p>
                  <AmplifyProvider theme={theme}>
                    <Authenticator >
                      {({ signOut, user }) => {
                        return (
                          <>
                            <Container >
                              <Home hideSignIn={this.hideSignIn} hideShowSignIn={this.hideShowSignIn} signedIn={this.state.signedIn} />
                            </Container>
                          </>
                        )
                      }
                      }
                    </Authenticator>
                  </AmplifyProvider>
                </div>

                {isMobile && <hr style={{ margin: '20px' }} />}
                <div >
                  {!this.state.signedIn && <SignInView />}
                </div>
              </Stack></> :

              <>
                <AmplifyProvider theme={theme}>
                  <Authenticator >
                    {({ signOut, user }) => {
                      return (
                        <>
                          <Container >
                            <Home hideSignIn={this.hideSignIn} hideShowSignIn={this.hideShowSignIn} signedIn={this.state.signedIn}  />
                          </Container>
                        </>
                      )
                    }
                    }
                  </Authenticator>
                </AmplifyProvider>
              </>
          }
        </div>
      </div>
    );
  }
}

export default App;
