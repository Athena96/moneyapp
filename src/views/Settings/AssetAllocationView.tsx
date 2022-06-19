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
import { Allocations, AssetAllocation, GlidePath, Input } from '../../model/Base/Input';

import PercentIcon from '@mui/icons-material/Percent';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

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
    }

    async componentDidMount() {
        if (this.props.simulation) {
            await InputDataAccess.fetchInputsForSelectedSim(this, this.props.simulation.getKey());
            console.log(JSON.stringify(this.state.input))
        }
    }

    async handleSave(e: any) {
        try {
            if (this.state.input) {
                await API.graphql(graphqlOperation(updateInputs, {
                    input: {
                        id: this.state.input.id,
                        settings: JSON.stringify(this.state.input.settings),
                        simulation: this.state.input?.simulation
                    }
                }));
            }
        } catch (err) {
            console.log('error updateInputs:', err)
        }
    }

    handleEquityChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, startEnd: string) {
        const target = e.target;
        const value: string = target.value;
        console.log("handleEquityChange")
        console.log("value " + value)
        if (this.state.input) {
            console.log("this.state.input")

            const ipt: Input = this.state.input;
            const assetAllocation: AssetAllocation = ipt.settings.assetAllocation;
            console.log("startEnd " + startEnd)
            console.log("assetAllocation.startAllocations " + startEnd)

            if (startEnd === "startAllocations") {
                console.log("startAllocations")

                if (!assetAllocation.startAllocations) {
                    assetAllocation.startAllocations = {
                        equities: "0",
                        bonds: "0",
                        cash: "0"
                    }
                }

                const newTotal = parseFloat(value) + parseFloat(assetAllocation.startAllocations.bonds) + parseFloat(assetAllocation.startAllocations.cash);
                if (newTotal > 100.0 || newTotal < 0.0) {
                    this.setState({ invalidPercentTotal: true });
                    return;
                } else {
                    this.setState({ invalidPercentTotal: false });
                }

                const startingAllocations: Allocations = assetAllocation.startAllocations
                startingAllocations.equities = value;
                this.setState({ input: ipt } as any);
            } else if (startEnd === "endAllocations") {
                console.log("endAllocations")
                if (!assetAllocation.endAllocations) {
                    assetAllocation.endAllocations = {
                        equities: "0",
                        bonds: "0",
                        cash: "0"
                    }
                }
                const newTotal = parseFloat(value) + parseFloat(assetAllocation.endAllocations.bonds) + parseFloat(assetAllocation.endAllocations.cash);
                if (newTotal > 100.0 || newTotal < 0.0) {
                    this.setState({ invalidPercentTotal: true });
                    return;
                } else {
                    this.setState({ invalidPercentTotal: false });
                }

                const endingAllocations: Allocations = assetAllocation.endAllocations
                endingAllocations.equities = value;
                this.setState({ input: ipt } as any);
            }
        }
    }

    handleBondChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, startEnd: string) {
        const target = e.target;
        const value: string = target.value;
        if (this.state.input) {
            const ipt: Input = this.state.input;
            const assetAllocation: AssetAllocation = ipt.settings.assetAllocation;
            if (startEnd === "startAllocations") {
                if (!assetAllocation.startAllocations) {
                    assetAllocation.startAllocations = {
                        equities: "0",
                        bonds: "0",
                        cash: "0"
                    }
                }
                const newTotal = parseFloat(value) + parseFloat(assetAllocation.startAllocations.equities) + parseFloat(assetAllocation.startAllocations.cash);
                if (newTotal > 100.0 || newTotal < 0.0) {
                    this.setState({ invalidPercentTotal: true });
                    return;
                } else {
                    this.setState({ invalidPercentTotal: false });
                }
                const startingAllocations: Allocations = assetAllocation.startAllocations
                startingAllocations.bonds = value;
                this.setState({ input: ipt } as any);
            } else if (startEnd === "endAllocations") {
                if (!assetAllocation.endAllocations) {
                    assetAllocation.endAllocations = {
                        equities: "0",
                        bonds: "0",
                        cash: "0"
                    }
                }
                const newTotal = parseFloat(value) + parseFloat(assetAllocation.endAllocations.equities) + parseFloat(assetAllocation.endAllocations.cash);
                if (newTotal > 100.0 || newTotal < 0.0) {
                    this.setState({ invalidPercentTotal: true });
                    return;
                } else {
                    this.setState({ invalidPercentTotal: false });
                }

                const endingAllocations: Allocations = assetAllocation.endAllocations
                endingAllocations.bonds = value;
                this.setState({ input: ipt } as any);
            }
        }
    }

    handleCashChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, startEnd: string) {
        const target = e.target;
        const value: string = target.value;
        if (this.state.input) {
            const ipt: Input = this.state.input;
            const assetAllocation: AssetAllocation = ipt.settings.assetAllocation;
            if (startEnd === "startAllocations") {
                if (!assetAllocation.startAllocations) {
                    assetAllocation.startAllocations = {
                        equities: "0",
                        bonds: "0",
                        cash: "0"
                    }
                }
                const newTotal = parseFloat(value) + parseFloat(assetAllocation.startAllocations.bonds) + parseFloat(assetAllocation.startAllocations.equities);
                if (newTotal > 100.0 || newTotal < 0.0) {
                    this.setState({ invalidPercentTotal: true });
                    return;
                } else {
                    this.setState({ invalidPercentTotal: false });
                }
                const startingAllocations: Allocations = assetAllocation.startAllocations
                startingAllocations.cash = value;
                this.setState({ input: ipt } as any);
            } else if (assetAllocation.endAllocations && startEnd === "endAllocations") {
                if (!assetAllocation.endAllocations) {
                    assetAllocation.endAllocations = {
                        equities: "0",
                        bonds: "0",
                        cash: "0"
                    }
                }
                const newTotal = parseFloat(value) + parseFloat(assetAllocation.endAllocations.bonds) + parseFloat(assetAllocation.endAllocations.equities);
                if (newTotal > 100.0 || newTotal < 0.0) {
                    this.setState({ invalidPercentTotal: true });
                    return;
                } else {
                    this.setState({ invalidPercentTotal: false });
                }

                const endingAllocations: Allocations = assetAllocation.endAllocations
                endingAllocations.cash = value;
                this.setState({ input: ipt } as any);
            }
        }
    }

    handleUseGlidePath(event: React.ChangeEvent<HTMLInputElement>) {
        console.log('handleUseGlidePath')
        const checked = event.target.checked;
        if (this.state.input) {
            const ipt: Input = this.state.input;

            ipt.settings.assetAllocation.glidePath = checked ? GlidePath.Evenly : null;
            this.setState({ input: ipt });
        }
    }


    render() {
        if (this.props.simulation && this.state.input) {
            const useGlidePath = this.state.input.settings.assetAllocation.glidePath !== null;
            return (
                <Box >
                    <h2>Asset Allocation</h2>
                    {this.state.invalidPercentTotal ? <Alert severity="error">This is an error alert — check it out!</Alert> : <></>}
                    <FormControlLabel control={<Checkbox name={`stock-allocation-end`} onChange={this.handleUseGlidePath} checked={useGlidePath} />} label="Change allocation over time?" />

                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                        <Grid item xs={6}>
                            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                                <CardContent>
                                    <Stack direction='column' spacing={2}>
                                        <h2>Stocks</h2>
                                        <TextField label={'Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleEquityChange(event, 'startAllocations')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.settings.assetAllocation?.startAllocations?.equities || ""}></TextField>
                                        {useGlidePath && <TextField label={'End Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleEquityChange(event, 'endAllocations')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.settings.assetAllocation?.endAllocations?.equities || ""}></TextField>}
                                        <Button id={''} onClick={this.handleSave} variant="contained">Save</Button>
                                    </Stack>

                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                                <CardContent>
                                    <Stack direction='column' spacing={2}>
                                        <h2>Bonds</h2>
                                        <TextField label={'Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleBondChange(event, 'startAllocations')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.settings.assetAllocation?.startAllocations?.bonds || ""}></TextField>
                                        {useGlidePath && <TextField label={'End Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleBondChange(event, 'endAllocations')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.settings.assetAllocation?.endAllocations?.bonds || ""}></TextField>}
                                        <Button id={''} onClick={this.handleSave} variant="contained">Save</Button>
                                    </Stack>

                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                                <CardContent>
                                    <Stack direction='column' spacing={2}>
                                        <h2>Cash</h2>
                                        <TextField label={'Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleCashChange(event, 'startAllocations')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.settings.assetAllocation?.startAllocations?.cash || ""}></TextField>
                                        {useGlidePath && <TextField label={'End Allocation %'} id="outlined-number" variant="outlined" onChange={(event) => this.handleCashChange(event, 'endAllocations')} InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PercentIcon />
                                                </InputAdornment>
                                            ),
                                        }} value={this.state.input.settings.assetAllocation?.endAllocations?.cash || ""}></TextField>}
                                        <Button id={''} onClick={this.handleSave} variant="contained">Save</Button>
                                    </Stack>

                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>


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
