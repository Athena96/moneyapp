import * as React from 'react';

import { API, graphqlOperation } from 'aws-amplify'
import { createSimulation, deleteAccount, deleteEvent, deleteInputs, deleteSimulation, updateSimulation } from '../graphql/mutations';
import { deleteBudget } from '../graphql/mutations'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LoadingButton from "@mui/lab/LoadingButton";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { Simulation } from '../model/Base/Simulation';
import { Budget } from '../model/Base/Budget';
import { Event } from '../model/Base/Event';
import { Input } from '../model/Base/Input';

import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';
import { InputDataAccess } from '../utilities/InputDataAccess';
import { EventDataAccess } from '../utilities/EventDataAccess';
import { cleanNumberDataInput } from '../utilities/helpers';
import { AccountDataAccess } from '../utilities/AccountDataAccess';
import { AssetDataAccess } from '../utilities/AssetDataAccess';
import { Account } from '../model/Base/Account';
import { Asset } from '../model/Base/Asset';

interface SimulationViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
    simulations: Simulation[];
    isLoading: boolean;
}

class SimulationView extends React.Component<SimulationViewProps, IState> {

    constructor(props: SimulationViewProps) {

        super(props);

        this.state = {
            simulations: [],
            isLoading: false
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
                    sim.selected = Number(cleanNumberDataInput(value));
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


            if (this.props.simulation) {
                try {
                    let selectedSim = SimulationDataAccess.getSelectedSimulation(this.state.simulations)!;
                    let newSimulation = new Simulation(new Date().getTime().toString(), '...', 0, '[]', "", new Date(), this.props.user);
                    let newSimulations = [...this.state.simulations, newSimulation]
                    await API.graphql(graphqlOperation(createSimulation, { input: newSimulation }));

                    // pull budgets from the current selected simulation
                    const defaultBudgets: Budget[] = await BudgetDataAccess.fetchDefaultBudgets(selectedSim.getKey());

                    // pull events  ...
                    const defaultEvents: Event[] = await EventDataAccess.fetchEventsForSelectedSim(null, selectedSim.getKey());

                    // pull inputs  ...
                    const defaultInputs: Input[] = await InputDataAccess.fetchDefaultInputs(selectedSim.getKey());

                    // pull inputs  ...
                    const defaultAccounts: Account[] = await AccountDataAccess.fetchAccountsForUserSelectedSim(null, selectedSim.getKey());

                    // pull inputs  ...
                    const defaultAssets: Asset[] = await AssetDataAccess.fetchAssetsForSelectedSim(null, selectedSim.getKey());

                    // for each budget
                    //  make a copy
                    //  set simulation to the newly created simulation id
                    //  create budget
                    for (const budget of defaultBudgets) {
                        const cpBudget: any = budget;
                        cpBudget['simulation'] = newSimulation.id;
                        cpBudget['id'] = new Date().getTime().toString()
                        let i = 0;
                        for (const cat of cpBudget['categories']) {
                            cat['id'] = (new Date().getTime() + i).toString();
                            i += 1;
                        }
                        await BudgetDataAccess.createBudgetBranch(cpBudget);
                    }

                    // same for events
                    for (const event of defaultEvents) {
                        const cpEvent: any = event;
                        cpEvent['simulation'] = newSimulation.id;
                        cpEvent['id'] = new Date().getTime().toString()

                        await EventDataAccess.createEventBranch(cpEvent);
                    }

                    // same for inputs
                    for (const input of defaultInputs) {
                        const cpInput: any = input;
                        cpInput['simulation'] = newSimulation.id;
                        cpInput['id'] = new Date().getTime().toString()
                        await InputDataAccess.createInputBranch(cpInput);
                    }

                    // same for accounts
                    for (const account of defaultAccounts) {
                        const cpAccount: any = account;
                        cpAccount['simulation'] = newSimulation.id;
                        cpAccount['id'] = new Date().getTime().toString()
                        await AccountDataAccess.createAccountBranch(cpAccount);
                    }

                    // same for assets
                    for (const asset of defaultAssets) {
                        const cpAsset: any = asset;
                        cpAsset['simulation'] = newSimulation.id;
                        cpAsset['id'] = new Date().getTime().toString()
                        delete cpAsset['strQuantity'];
                        await AssetDataAccess.createAssetBranch(cpAsset);
                    }

                    this.setState({ simulations: newSimulations });
                    this.setState({ isLoading: false });

                } catch (err) {
                    console.log('error creating...:', err);
                    this.setState({ isLoading: false });
                }
            } else {
                // create just 1 sim.

                let newSimulation = new Simulation(new Date().getTime().toString(), '...', 1, '[]', "", new Date(), this.props.user);
                let newSimulations = [...this.state.simulations, newSimulation]
                await API.graphql(graphqlOperation(createSimulation, { input: newSimulation }));
                this.setState({ simulations: newSimulations });
                this.setState({ isLoading: false });
            }


        } else {
            console.log('did not create new Simulation.');
            return;

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
        if (window.confirm('Are you sure you want to DELETE this simulation? It will delete all associated Budgets/Events/Inputs...')) {
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

            this.setState({ isLoading: true });

            try {
                await API.graphql({ query: deleteSimulation, variables: { input: simulationToDelete } });


                // get all budgets
                //  if simulation == simtodelte.id
                //  delete
                const budgets = await BudgetDataAccess.fetchBudgetsForSelectedSim(null, simulationToDelete!['id']);
                const events = await EventDataAccess.fetchEventsForSelectedSim(null, simulationToDelete!['id']);
                const inputs = await InputDataAccess.fetchInputsForSelectedSim(null, simulationToDelete!['id']);
                const accounts = await AccountDataAccess.fetchAccountsForUserSelectedSim(null, simulationToDelete!['id']);
                const assets = await AssetDataAccess.fetchAssetsForSelectedSim(null, simulationToDelete!['id']);

                for (const b of budgets) {

                    try {
                        await API.graphql({ query: deleteBudget, variables: { input: { 'id': b.id } } });
                    } catch (err) {
                        console.log('error:', err)
                    }

                }

                for (const e of events) {

                    try {
                        await API.graphql({ query: deleteEvent, variables: { input: { 'id': e.id } } });
                    } catch (err) {
                        console.log('error:', err)
                    }

                }

                for (const i of inputs) {

                    try {
                        await API.graphql({ query: deleteInputs, variables: { input: { 'id': i.id } } });
                    } catch (err) {
                        console.log('error:', err)
                    }

                }

                for (const ac of accounts) {
                    try {
                        await API.graphql({ query: deleteAccount, variables: { input: { 'id': ac.id } } });
                    } catch (err) {
                        console.log('error:', err)
                    }

                }

                for (const as of assets) {

                    try {
                        await API.graphql({ query: deleteInputs, variables: { input: { 'id': as.id } } });
                    } catch (err) {
                        console.log('error:', err)
                    }

                }

                this.setState({ simulations: newSimulations });
                this.setState({ isLoading: false });
            } catch (err) {
                console.log('error:', err);
                this.setState({ isLoading: false });
            }
        } else {
            console.log('chose not to delete');
            return;
        }
    }

    handleEditSimulation(event: any) {
        console.log((event.target as Element).id);
    }

    render() {
        return (
            <Box >
                <h1 >Scenarios</h1>
                {this.state.isLoading ? <><Box style={{ textAlign: 'center' }}>
                    <LinearProgress />
                    <br />
                </Box></> : <></>}

                {this.state.isLoading ? <><LoadingButton loading style={{ width: "100%" }} onClick={this.handleAddSimulation} variant="outlined">Create New Life Scenario + </LoadingButton></> : <><LoadingButton style={{ width: "100%" }} onClick={this.handleAddSimulation} variant="outlined">Create New Life Scenario + </LoadingButton></>}

                {this.state.simulations.map((simulation: Simulation) => {
                    return (

                        <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                            <CardContent>
                                <Stack direction='column' spacing={2}>
                                    <TextField label="Name" id="outlined-basic" variant="outlined" name={`name-${simulation.getKey()}`} onChange={this.handleChange} value={simulation.name} />
                                    <TextField label="Is Selected?" id="outlined-basic" variant="outlined" name={`selected-${simulation.getKey()}`} onChange={this.handleChange} value={simulation.selected} />

                                    <LoadingButton id={simulation.getKey()} onClick={this.handleDelete} variant="outlined">Delete</LoadingButton>
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
