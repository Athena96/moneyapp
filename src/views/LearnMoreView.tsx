import * as React from 'react';
import { moneyGreen } from '../utilities/constants';
import main from '../images/main.png'
import Paper from '@mui/material/Paper';

interface LearnMoreViewProps {

}

interface IState {

}

class LearnMoreView extends React.Component<LearnMoreViewProps, IState> {
    constructor(props: LearnMoreViewProps) {
        super(props);
        this.state = {}
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount() {
    }

    render() {
        return (
            <div style={{ textAlign: "left", margin: '20px' }}>
        <h1 style={{ color: moneyGreen }}>Money Tomorrow</h1>
        <h2 style={{ color: "grey" }}>Money can't buy happiness, but it can buy... peace 🧘</h2>
                
                <hr/>

                <h3 style={{ color: "grey" }}>Retire with confidence.</h3>

                <p >This is a simple, free tool that uses <a target="_blank " href="https://www.investopedia.com/terms/m/montecarlosimulation.asp#:~:text=A%20Monte%20Carlo%20simulation%20is,in%20prediction%20and%20forecasting%20models.">Monte Carlo simulation</a> to help you determine when you can retire.</p>
                <p >You input how much you're saving, your living expenses, and your assets and we uses this to project out how your portfolio will perform!</p>


                <h3>Video Tutorials</h3>

                <p>📺 <a target="_blank " href="https://youtu.be/3cgWJbxQ-5I">Create Account Tutorial</a></p>
                <p>📺 <a target="_blank " href="https://youtu.be/Pkk8YA-jYDQ">How to use the Life Scenarios Feature</a></p>


                {/* <Card variant="outlined"> */}
                <Paper elevation={3} style={{borderRadius: '10px'}} >
                <img src={main} alt="main"  style={{borderRadius: '10px', width: '100%'}}  />

                    </Paper>

                {/* </Card> */}


                <br />
            </div>
        );
    }
}

export default LearnMoreView;