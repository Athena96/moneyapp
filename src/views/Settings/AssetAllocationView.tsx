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
import { Allocations, AssetAllocation, Input } from '../../model/Base/Input';

import PercentIcon from '@mui/icons-material/Percent';
import InputAdornment from '@mui/material/InputAdornment';

interface AssetAllocationViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
    input: Input | undefined
}

class AssetAllocationView extends React.Component<AssetAllocationViewProps, IState> {

    constructor(props: AssetAllocationViewProps) {

        super(props);

        this.state = {
            input: undefined
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
        this.handleSave = this.handleSave.bind(this);
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
        if (this.state.input) {
            const ipt: Input = this.state.input;
            const assetAllocation: AssetAllocation = ipt.settings.assetAllocation;
            if (assetAllocation.startAllocations) {
                const startingAllocations: Allocations = assetAllocation.startAllocations
                startingAllocations.equities = value;
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
            if (assetAllocation.startAllocations) {
                const startingAllocations: Allocations = assetAllocation.startAllocations
                startingAllocations.bonds = value;
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
            if (assetAllocation.startAllocations) {
                const startingAllocations: Allocations = assetAllocation.startAllocations
                startingAllocations.cash = value;
                this.setState({ input: ipt } as any);
            }
        }
    }


    render() {
        if (this.props.simulation && this.state.input) {
            return (
                <Box >
                    <h2>Asset Allocation</h2>

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
