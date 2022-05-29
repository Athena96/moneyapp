import * as React from 'react';

import { InputDataAccess } from '../utilities/InputDataAccess';
import { Simulation } from '../model/Base/Simulation';
import { Input } from '../model/Base/Input';

import { Link } from "react-router-dom";

import AccountsView from './AccountsView';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Divider from '@mui/material/Divider';


interface SettingsViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
    selectedInput: Input | undefined;
}

class SettingsView extends React.Component<SettingsViewProps, IState> {

    constructor(props: SettingsViewProps) {

        super(props);

        this.state = {
            selectedInput: undefined,
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
        this.handleSave = this.handleSave.bind(this);

    }

    async componentDidMount() {
        if (this.props.simulation) {
            // todo add inputs
            await InputDataAccess.fetchInputsForSelectedSim(this, this.props.simulation.getKey());

        }
    }

    async handleSave(e: any) {
        // console.log('bd ' + this.state.birthday)
    }




    render() {
        if (this.props.simulation && this.state.selectedInput) {
            // const settings = JSON.parse(this.state.selectedInput.settings);
            const birthday = '04/25/1996'
            return (
                <Box >
                    <h1>Settings</h1>
                    <h2>Birthday</h2>

                    <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                        <CardContent>
                            <Stack direction='column' spacing={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Birthday"
                                        value={birthday}
                                        onChange={(newValue) => {

                                            this.setState({ birthday: newValue } as any);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <Button id={''} onClick={this.handleSave} variant="contained">Save</Button>
                            </Stack>

                        </CardContent>
                    </Card>
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
