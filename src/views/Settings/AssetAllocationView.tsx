import * as React from 'react';

import { API, graphqlOperation } from 'aws-amplify'
import { updateInputs } from '../../graphql/mutations'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { Simulation } from '../../model/Base/Simulation';
import Box from '@mui/material/Box';


import Grid from '@mui/material/Grid';

import { InputDataAccess } from '../../utilities/InputDataAccess';
import { Input } from '../../model/Base/Input';

import PercentIcon from '@mui/icons-material/Percent';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';

import { GlidePath } from '../../API';
import { Allocations } from '../../model/Base/Allocations';

interface AssetAllocationViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
    input: Input | undefined;
    invalidPercentTotal: boolean;
}

class AssetAllocationView extends React.Component<AssetAllocationViewProps, IState> {

    constructor(props: AssetAllocationViewProps) {

        super(props);

        this.state = {
            invalidPercentTotal: false,
            input: undefined
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUseGlidePath = this.handleUseGlidePath.bind(this);
        this.validPercentsCheck = this.validPercentsCheck.bind(this);
    }

    async componentDidMount() {
        if (this.props.simulation) {
            await InputDataAccess.fetchInputsForSelectedSim(this, this.props.simulation.getKey());
        }
    }

    async handleSave(e: any) {
        try {
            if (this.state.input) {
                await API.graphql(graphqlOperation(updateInputs, {
                    input: {
                        id: this.state.input.id,
                        assetAllocation: this.state.input.assetAllocation,
                        simulation: this.state.input?.simulation
                    }
                }));
            }
        } catch (err) {
            console.error('error updateInputs:', err)
        }
    }

    handleUseGlidePath(event: React.ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked;
        if (this.state.input) {
            const updatedInput: Input = this.state.input;
            updatedInput.assetAllocation.glidePath = checked ? GlidePath.Evenly : undefined;
            updatedInput.assetAllocation.endAllocations = checked ? new Allocations('45.0',
                '50.0',
                '5.0') : undefined;

            this.setState({ input: updatedInput });
        }
    }

    validPercentsCheck(input: Input, stardOrEnd: string) {
        let newTotal = 0.0;
        switch (stardOrEnd) {
            case "Start":
                newTotal = parseFloat(input.assetAllocation.startAllocations.equities) +
                    parseFloat(input.assetAllocation.startAllocations.bonds) +
                    parseFloat(input.assetAllocation.startAllocations.cash);
                break;
            case "End":
                newTotal = parseFloat(input.assetAllocation.endAllocations!.equities) +
                    parseFloat(input.assetAllocation.endAllocations!.bonds) +
                    parseFloat(input.assetAllocation.endAllocations!.cash);
                break;
        }
        if (newTotal > 100.0 || newTotal < 0.0) {
            this.setState({ invalidPercentTotal: true });
            return;
        } else {
            this.setState({ invalidPercentTotal: false });
        }
    }

    handleAllocationChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, stardOrEnd: string, asset: 'equities' | 'bonds' | 'cash') {
        const target = e.target;
        const value: string = target.value;

        if (this.state.input) {
            const updatedInput: Input = this.state.input;
            switch (stardOrEnd) {
                case "Start":
                    updatedInput.assetAllocation.startAllocations[asset] = value;
                    break;
                case "End":
                    updatedInput.assetAllocation.endAllocations![asset] = value;
                    break;
            }
            this.validPercentsCheck(updatedInput, stardOrEnd)
            this.setState({ input: updatedInput });
        }
    }

    render() {
        if (this.props.simulation && this.state.input) {
            // const useGlidePath = this.state.input.assetAllocation?.glidePath ? true : false;
            return (
                <Box >
                    <h2>Asset Allocation</h2>
                    {this.state.invalidPercentTotal ? <Alert severity="error">The total Asset Allocation needs to add up to 100% </Alert> : <></>}
                    {/* <FormControlLabel control={<Checkbox name={`stock-allocation-end`} onChange={this.handleUseGlidePath} checked={useGlidePath} />} label="Change allocation over time?" /> */}

                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                        <Grid item xs={6}>
                            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                                <CardContent>
                                    <Stack direction='column' spacing={2}>
                                        <h2>Stocks</h2>
                                        <TextField label={'Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleAllocationChange(event, "Start", 'equities')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.assetAllocation?.startAllocations?.equities || ""}></TextField>

                                        {/* {useGlidePath && <TextField label={'End Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleAllocationChange(event, "End", 'equities')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.assetAllocation?.endAllocations?.equities || ""}></TextField>} */}
                                    </Stack>

                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                                <CardContent>
                                    <Stack direction='column' spacing={2}>
                                        <h2>Bonds</h2>
                                        <TextField label={'Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleAllocationChange(event, "Start", 'bonds')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.assetAllocation?.startAllocations?.bonds || ""}></TextField>
                                        {/* {useGlidePath && <TextField label={'End Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleAllocationChange(event, "End", 'bonds')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.assetAllocation?.endAllocations?.bonds || ""}></TextField>} */}
                                    </Stack>

                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                                <CardContent>
                                    <Stack direction='column' spacing={2}>
                                        <h2>Cash</h2>
                                        <TextField label={'Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleAllocationChange(event, "Start", 'cash')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.assetAllocation?.startAllocations?.cash || ""}></TextField>
                                        {/* {useGlidePath && <TextField label={'End Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleAllocationChange(event, "End", 'cash')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.assetAllocation?.endAllocations?.cash || ""}></TextField>} */}
                                    </Stack>

                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <br />

                    <Button sx={{ width: '100%' }} id={''} onClick={this.handleSave} variant="contained">Save</Button>
                    <br />
                    <br />

                </Box>
            )
        } else {
            return (
                <></>
            )
        }
    }
}
export default AssetAllocationView;