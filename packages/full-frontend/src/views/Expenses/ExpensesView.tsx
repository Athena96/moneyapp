import * as React from 'react';

import { Simulation } from '../../model/Base/Simulation';
import { Link } from "react-router-dom";
import { CategoryTypes } from '../../API';
import BudgetsEventsView from '../SharedViews/BudgetsEventsView';

interface ExpensesViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface ExpensesViewState {
}

class ExpensesView extends React.Component<ExpensesViewProps, ExpensesViewState> {

    constructor(props: ExpensesViewProps) {
        super(props);
        this.state = { }
    }

    render() {
        if (this.props.simulation) {
            return (
                <BudgetsEventsView user={this.props.user} simulation={this.props.simulation} type={CategoryTypes.Expense}/>
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

export default ExpensesView;
