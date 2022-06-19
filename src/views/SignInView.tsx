import * as React from 'react';
import { moneyGreen } from '../utilities/constants';

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
            <div style={{ textAlign: "center" }}>
                <h1 style={{ color: moneyGreen }}>Money Tomorrow</h1>
                <h3 style={{ color: "grey" }}>Money can't buy happiness, but it can buy... peace 🧘</h3>
                <br />
            </div>
        );
    }
}

export default SignInView;