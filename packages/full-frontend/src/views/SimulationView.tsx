import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LoadingButton from "@mui/lab/LoadingButton";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Dialog from '@mui/material/Dialog';

import { Simulation } from '../model/Base/Simulation';

import { SimulationDataAccess } from '../utilities/SimulationDataAccess';

interface SimulationViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
    simulations: Simulation[];
    isLoading: boolean;
    showError: boolean;
}

class SimulationView extends React.Component<SimulationViewProps, IState> {

    constructor(props: SimulationViewProps) {
        super(props);
        this.state = {
            simulations: [],
            isLoading: false,
            showError: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAddSimulation = this.handleAddSimulation.bind(this);
        this.getSimulationToSave = this.getSimulationToSave.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.render = this.render.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        const sims = this.state.simulations;
        const tp = name.split('-')[0];
        const key = name.split('-')[1];
        for (const sim of sims) {
            if (sim.getKey() === key) {
                if (tp === 'name') {
                    sim.name = value;
                }
            }
        }
        this.setState({ simulations: sims });
    }

    async componentDidMount() {
        await SimulationDataAccess.fetchSimulationsForUser(this, this.props.user);
    }

    async handleAddSimulation() {
        if (window.confirm('Are you sure you want to ADD a new Simulation? This will copy all current Budget/Events/Inputs to a new Simulation branch.')) {
            this.setState({ isLoading: true });
            const selectedSim = SimulationDataAccess.getSelectedSimulation(this.state.simulations)!;
            const newSim = await SimulationDataAccess.createSimulationFromBase(selectedSim.getKey(), this.props.user);
            if (newSim !== undefined) {
                const newSimulations = [...this.state.simulations, newSim]
                this.setState({ isLoading: false });
                this.setState({ simulations: newSimulations });
            }
        }
    }

    getSimulationToSave(id: string) {
        for (const i of this.state.simulations) {
            if (i.id === id) {
                return i;
            }
        }
    }

    async handleSave(e: any) {
        const id = e.target.id;
        const sim = this.getSimulationToSave(id);
        if (sim)
            await SimulationDataAccess.updateSimulation(sim);
    }


    async handleDelete(simulation: Simulation) {
        if (simulation.selected === 1 || this.state.simulations.length === 1) {
            this.setState({ showError: true });
            return;
        }

        if (window.confirm('Are you sure you want to DELETE this simulation? It will delete all associated Budgets/Events/Inputs...')) {
            const idToDelete = simulation.id;
            let newSimulations = [];

            for (const simulation of this.state.simulations) {
                if (simulation.getKey() === idToDelete) {
                    continue;
                }
                newSimulations.push(simulation);
            }

            this.setState({ isLoading: true });
            try {
                await SimulationDataAccess.deleteSelectedSimulation(simulation);
            } catch (e) {
                this.setState({ isLoading: false });

            }
            this.setState({ simulations: newSimulations });
            this.setState({ isLoading: false });
            window.location.reload();
        }
    }

    handleEditSimulation(event: any) {
    }

    closeDialog() {
        this.setState({ showError: false });
    }

    render() {
        return (
            <Box sx={{ margin: '20px' }}>
                <h1>Scenarios</h1>

                <Dialog open={this.state.showError} onClose={this.closeDialog}>
                    <Alert severity="error">
                        <AlertTitle>Oops</AlertTitle>
                        You tried to delete the current Scenario you have selected, or you tried deleting the only Scenario you have (you must always have at least 1 Scenario).<br />
                    </Alert>
                </Dialog>

                {this.state.isLoading ? <><Box style={{ textAlign: 'center' }}>
                    <LinearProgress />
                    <br />
                </Box></> : <></>}

                { this.state.isLoading ? 

                <><LoadingButton loading style={{ width: "100%" }} onClick={this.handleAddSimulation} variant="outlined">Create New Life Scenario + </LoadingButton></> :
                
                <><LoadingButton style={{ width: "100%" }} onClick={this.handleAddSimulation} variant="outlined">Create New Life Scenario + </LoadingButton></> }

                {this.state.simulations.map((simulation: Simulation) => {
                    return (
                        <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                            <CardContent>
                                <Stack direction='column' spacing={2}>
                                    <TextField label="Name" id="outlined-basic" variant="outlined" name={`name-${simulation.getKey()}`} onChange={this.handleChange} value={simulation.name} />

                                    <LoadingButton id={simulation.getKey()} onClick={(e) => this.handleDelete(simulation)} variant="outlined">Delete</LoadingButton>
                                    <LoadingButton id={simulation.getKey()} onClick={this.handleSave} variant="contained" >Save</LoadingButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    )
                })}
            </Box>
        );
    }
}

export default SimulationView;
