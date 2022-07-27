import * as React from 'react';
import { moneyGreen } from '../utilities/constants';
import main from '../images/main.png'
import Paper from '@mui/material/Paper';

interface SignInViewProps {

}

interface IState {

}

class SignInView extends React.Component<SignInViewProps, IState> {
    constructor(props: SignInViewProps) {
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

                <p >This is a simple, free tool that uses Monte Carlo simulation to help you determine when you can retire.</p>
                <p >You input how much you're saving, your living expenses, and your assets and we uses this to project out how your portfolio will perform!</p>

                <p >Create your free account today to answer the question of when you can retire, if might be sooner than you think!</p>


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

export default SignInView;