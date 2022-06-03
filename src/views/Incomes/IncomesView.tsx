import * as React from 'react';

import { Simulation } from '../../model/Base/Simulation';
import { Link } from "react-router-dom";
import { CategoryTypes } from '../../API';
import BudgetsEventsView from '../SharedViews/BudgetsEventsView';

interface IncomesViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
}

class IncomesView extends React.Component<IncomesViewProps, IState> {

    constructor(props: IncomesViewProps) {
        super(props);
        this.state = { }
    }

    render() {
        if (this.props.simulation) {
            return (
                <BudgetsEventsView user={this.props.user} simulation={this.props.simulation} type={CategoryTypes.Income}/>
            )
        } else {
            return (
                <div style={{ textAlign: 'center' }}>
                    <p>Please create a <b>Life Scenario</b> first. <br />Click <Link to="/scenarios">here</Link> to create one!</p>
                </div>
            )
        }
    }

}

export default IncomesView;
