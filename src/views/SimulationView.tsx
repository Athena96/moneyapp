import * as React from 'react';

import { API, graphqlOperation } from 'aws-amplify'
import { createSimulation, deleteSimulation, updateSimulation } from '../graphql/mutations';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import { Link } from "react-router-dom";

import { Simulation } from '../model/Simulation';
import { fetchSimulations } from '../utilities/helpers';

interface SimulationViewProps {
    value: number;
    index: number;
}

interface IState {
    simulations: Simulation[];
}

class SimulationView extends React.Component<SimulationViewProps, IState> {

    constructor(props: SimulationViewProps) {

        super(props);

        this.state = {
            simulations: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAddSimulation = this.handleAddSimulation.bind(this);
        this.getSimulationToSave = this.getSimulationToSave.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.render = this.render.bind(this);
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
                if (tp === 'selected') {
                    sim.selected = Number(value);
                }

            }
        }
        this.setState({ simulations: sims });

    }

    componentDidMount() {
        fetchSimulations(this);
    }

    async handleAddSimulation() {
        try {
            let newSimulation = new Simulation(new Date().getTime().toString(), '...', 0);
            let newSimulations = [...this.state.simulations, newSimulation]
            this.setState({ simulations: newSimulations });
            await API.graphql(graphqlOperation(createSimulation, { input: newSimulation }))
        } catch (err) {
            console.log('error creating todo:', err)
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

        try {
            const sim = this.getSimulationToSave(id);
            await API.graphql(graphqlOperation(updateSimulation, { input: sim }));
        } catch (err) {
            console.log('error creating account:', err)
        }
    }

    async handleDelete(event: any) {
        const idToDelete = (event.target as Element).id;
        let newSimulations = [];
        let simulationToDelete = null;

        for (const simulation of this.state.simulations) {
            if (simulation.getKey() === idToDelete) {
                simulationToDelete = {
                    'id': simulation.getKey()
                }
                continue;
            }
            newSimulations.push(simulation);

        }
        this.setState({ simulations: newSimulations });
        try {
            await API.graphql({ query: deleteSimulation, variables: { input: simulationToDelete } });
        } catch (err) {
            console.log('error:', err)
        }
    }

    handleEditSimulation(event: any) {
        console.log((event.target as Element).id);
    }

    render() {
        return this.props.index === this.props.value ? (
            <>
                <Button style={{ width: "100%" }} onClick={this.handleAddSimulation} variant="outlined">Add Simulation</Button>

                {this.state.simulations.map((simulation: Simulation) => {
                    return (

                        <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                            <CardContent>
                                <Stack direction='column' spacing={2}>
                                    <TextField label="Name" id="outlined-basic" variant="outlined" name={`name-${simulation.getKey()}`} onChange={this.handleChange} value={simulation.name} />
                                    <TextField label="Is Selected?" id="outlined-basic" variant="outlined" name={`selected-${simulation.getKey()}`} onChange={this.handleChange} value={simulation.selected} />

                                    <Button id={simulation.getKey()} onClick={this.handleDelete} variant="outlined">Delete</Button>
                                    <Button id={simulation.getKey()} onClick={this.handleSave} variant="contained">Save</Button>
                                </Stack>

                            </CardContent>
                        </Card>

                    )
                })}
            </>
        ) : (<></>);
    }

}

export default SimulationView;
