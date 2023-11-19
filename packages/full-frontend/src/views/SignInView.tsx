import * as React from 'react';
import {INVEST_LINK, moneyGreen} from '../utilities/constants';
import Paper from '@mui/material/Paper';

interface SignInViewProps {

}

interface IState {

}

class SignInView extends React.Component<SignInViewProps, IState> {
  constructor(props: SignInViewProps) {
    super(props);
    this.state = {};
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
  }

  render() {
    return (
      <div style={{textAlign: 'left', margin: '20px'}}>
        <h1 style={{color: moneyGreen}}>Money Tomorrow</h1>
        <h2 style={{color: 'grey'}}>Money can&apos;t buy happiness, but it can buy... peace 🧘</h2>

        <hr/>

        <h3 style={{color: 'grey'}}>Retire with confidence.</h3>


        <p >This is a simple, free tool that uses
          <a target="_blank " href={INVEST_LINK}>
                Monte Carlo simulation</a> to help you determine when you can retire.</p>
        <p >You input how much you&apos;re saving, your living expenses, and your assets
             and we uses this to project out how your portfolio will perform!</p>

        <p >Create your free account today to answer the question
            of when you can retire, it might be sooner than you think!</p>
        <p>📺 check out this <a
          target="_blank "
          href="https://youtu.be/3cgWJbxQ-5I">short video</a>
        to learn more!</p>

        {/* <Card variant="outlined"> */}
        <Paper elevation={3} style={{borderRadius: '10px'}} >
          <img src={require('../images/Main.png')} alt="main" style={{borderRadius: '10px', width: '100%'}} />

        </Paper>

        {/* </Card> */}


        <br />
      </div>
    );
  }
}

export default SignInView;
