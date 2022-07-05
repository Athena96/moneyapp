import * as React from 'react';

import { InputDataAccess } from '../../utilities/InputDataAccess';
import { Simulation } from '../../model/Base/Simulation';
import { Input } from '../../model/Base/Input';

import { Link } from "react-router-dom";


import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountsView from './AccountsView';
import AssetAllocationView from './AssetAllocationView';

interface SettingsViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
    input: Input | undefined;
}

class SettingsView extends React.Component<SettingsViewProps, IState> {

    constructor(props: SettingsViewProps) {

        super(props);

        this.state = {
            input: undefined,
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    async componentDidMount() {
        if (this.props.simulation) {
            await InputDataAccess.fetchInputsForSelectedSim(this, this.props.simulation.getKey());
        }
    }

    async handleSave(e: any) {
        // console.log('bd ' + this.state.birthday)
    }

    render() {
        if (this.props.simulation && this.state.input) {
            return (
                <Box >
                    <Stack direction='row' spacing={1}>
                        <AccountCircleIcon />
                        <small >{this.props.user}</small>
                    </Stack>
                    <h1 >Settings</h1>

                    <Divider />

                    <AssetAllocationView user={this.props.user} simulation={this.props.simulation} />

                    <br />
                    <br />
                    <Divider />

                    <AccountsView user={this.props.user} simulation={this.props.simulation} />
                </Box>
            )
        } else {
            return (
                <div style={{ textAlign: 'center' }}>
                    <p>Please create a <b>Simulation</b> first. <br />Click <Link to="/scenarios">here</Link> to create one!</p>
                </div>
            )
        }
    }

}

export default SettingsView;
