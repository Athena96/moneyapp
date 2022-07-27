import * as React from 'react';

import { API, graphqlOperation } from 'aws-amplify'
import { updateEvent } from '../../graphql/mutations'
import { CategoryTypes } from '../../API';

import { Simulation } from "../../model/Base/Simulation";
import { Event } from "../../model/Base/Event";

import { cleanNumberDataInput } from '../../utilities/helpers';
import { EventDataAccess } from '../../utilities/EventDataAccess';
import { AccountDataAccess } from '../../utilities/AccountDataAccess';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Account } from '../../model/Base/Account';

interface EventDialogViewProps {
    user: string;
    simulation: Simulation;
    event: Event;
    type: CategoryTypes;
    closeDialog?: () => void;
}

interface EventDialogViewState {
    eventToSave: Event;
    accounts: Account[];
}

class EventDialogView extends React.Component<EventDialogViewProps, EventDialogViewState> {
    constructor(props: EventDialogViewProps) {
        super(props)

        this.state = {
            eventToSave: this.props.event,
            accounts: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleAccountChange = this.handleAccountChange.bind(this);
    }

    async componentDidMount() {
        await AccountDataAccess.fetchAccountsForUserSelectedSim(this, this.props.simulation.getKey());
    }

    handleOneTimeValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newVal = event.target.value;

        if (this.state.eventToSave) {
            const event = this.state.eventToSave;
            event.category!.setValue(cleanNumberDataInput(newVal));
            this.setState({ eventToSave: event })
        }
    }

    handleOneTimeNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newName = event.target.value;
        if (this.state.eventToSave) {
            const event = this.state.eventToSave;
            event.name = newName;
            this.setState({ eventToSave: event })
        }
    }

    handleOneTimeDateChange(newDate: Date | null) {
        if (this.state.eventToSave && newDate) {
            const event = this.state.eventToSave;
            event.date = newDate;
            this.setState({ eventToSave: event })
        }
    }

    handleAccountChange(event: SelectChangeEvent) {
        const account = event.target.value as string;
        if (this.state.eventToSave) {
            const event = this.state.eventToSave;
            event.account = account;
            this.setState({ eventToSave: event })
        }
    }

    async saveEvent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, eventToSave: Event) {
        try {
            await API.graphql(graphqlOperation(updateEvent, { input: EventDataAccess.convertToDDBObject(eventToSave, this.props.simulation!.id) }))
        } catch (err) {
            console.error('error creating todo:', err)
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }

    render() {
        return (
            <>
                <DialogTitle>One-time {this.props.type === CategoryTypes.Expense ? "Expense" : "Income"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    </DialogContentText>

                    <Stack direction='column' spacing={0}>
                        <br />
                        {this.props.event && <TextField label={'label'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleOneTimeNameChange(event)} value={this.props.event.name} />}<br />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">account</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.props.event.account}
                                label="account"
                                onChange={this.handleAccountChange}
                            >
                                {this.state.accounts.map((account: Account, z: number) => {
                                    return (
                                        <MenuItem key={z} value={`${account.name}`}>{account.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <br />

                        {this.props.event && <TextField label={'amount'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleOneTimeValueChange(event)} InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoneyIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    Monthly
                                </InputAdornment>
                            ),
                        }} value={this.props.event.category!.strValue}></TextField>}

                        <br />
                        <Stack direction='row' spacing={2}>

                            {this.props.event && <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="date"
                                    value={this.props.event.date}
                                    onChange={(newDate) => this.handleOneTimeDateChange(newDate)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>}

                        </Stack>

                    </Stack>

                    <DialogActions>
                        {this.props.closeDialog && <Button onClick={this.props.closeDialog}>Cancel</Button> }
                        <Button onClick={(e) => this.saveEvent(e, this.state.eventToSave)}>Save</Button>
                    </DialogActions>

                </DialogContent>

            </>
        )
    }


}

export default EventDialogView;
