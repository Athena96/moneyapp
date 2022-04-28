import * as React from 'react';

import { API, graphqlOperation } from 'aws-amplify'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';


import { createAssets, deleteAssets, updateAssets } from '../graphql/mutations';
import { Asset } from '../model/Base/Asset';
import { AssetDataAccess } from '../utilities/AssetDataAccess';
import { cleanNumberDataInput } from '../utilities/helpers';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Auth } from 'aws-amplify';
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';

interface AssetsViewProps {
    value: number;
    index: number;
}

interface IState {
    assets: Asset[]
}

class AssetsView extends React.Component<AssetsViewProps, IState> {

    constructor(props: AssetsViewProps) {

        super(props);

        this.state = {
            assets: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAddInput = this.handleAddInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.render = this.render.bind(this);
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        const assts = this.state.assets;
        const tp = name.split('-')[0];
        const key = name.split('-')[1];

        for (const asset of assts) {

            if (asset.getKey() === key) {
                if (tp === 'ticker') {
                    asset.ticker = value;
                }
                if (tp === 'quantity') {
                    asset.setQuantity(cleanNumberDataInput(value));
                }
                if (tp === 'hasIndexData') {
                    asset.hasIndexData = Number(value);
                }
                if (tp === 'isCurrency') {
                    asset.isCurrency = Number(value);
                }
            }
        }
        this.setState({ assets: assts });

    }

    async componentDidMount() {
        const user = await Auth.currentAuthenticatedUser();
        const email: string = user.attributes.email;
        const selectedSim = await SimulationDataAccess.fetchSelectedSimulationForUser(this, email);
        AssetDataAccess.fetchAssetsForSelectedSim(this, selectedSim.getKey());
    }

    async handleAddInput() {
        try {
            let newDBAsset = { id: new Date().getTime().toString(), ticker: "OOO", quantity: 0, hasIndexData: 1, account: "brokerage", isCurrency: 0 };

            let newAsset = new Asset(new Date().getTime().toString(), "OOO", "0", 1, 'brokerage', 0);
            let newAssets = [...this.state.assets, newAsset]
            this.setState({ assets: newAssets });
            await API.graphql(graphqlOperation(createAssets, { input: newDBAsset }))
        } catch (err) {
            console.log('error creating todo:', err)
        }

    }

    getAssetToSave(id: string) {
        for (const i of this.state.assets) {
            if (i.getKey() === id) {
                return i;
            }
        }
    }

    async handleSave(e: any) {
        const id = e.target.id;

        try {
            const ipt = this.getAssetToSave(id);
            let d = ipt;
            delete d?.strQuantity;
            await API.graphql(graphqlOperation(updateAssets, { input: d! }));
        } catch (err) {
            console.log('error creating account:', err)
        }
    }

    async handleDelete(event: any) {
        const idToDelete = (event.target as Element).id;
        if (window.confirm('Are you sure you want to DELETE this Asset?')) {
            let newAssets = [];
            let assetToDelete = null;

            for (const asset of this.state.assets) {
                if (asset.getKey() === idToDelete) {
                    assetToDelete = {
                        'id': asset.getKey()
                    }
                    continue;
                }
                newAssets.push(asset);

            }
            this.setState({ assets: newAssets });
            try {
                await API.graphql({ query: deleteAssets, variables: { input: assetToDelete } });
            } catch (err) {
                console.log('error:', err)
            }
        }
    }

    handleDropChange = (event: SelectChangeEvent) => {
        const accnt = event.target.value as string;
        this.setState({ 'account': accnt } as any);
    };
    render() {

        if (this.props.index === this.props.value) {

            return (
                < >

                    <Button style={{ width: "100%" }} onClick={this.handleAddInput} variant="outlined">add assets +</Button>
                    {this.state.assets ? this.state.assets.sort((a, b) => (a.id > b.id) ? 1 : -1).map((asset: Asset, i: number) => {

                        return (
                            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                                <CardContent>
                                    <Stack direction='column' spacing={2}>
                                        <TextField label="Ticker Code" id="outlined-basic" variant="outlined" name={`ticker-${asset.getKey()}`} onChange={this.handleChange} value={asset.ticker} />
                                        <TextField label="Quantity" id="outlined-basic" variant="outlined" name={`quantity-${asset.getKey()}`} onChange={this.handleChange} value={asset.strQuantity} />
                                        <TextField label="Has Data in API" id="outlined-basic" variant="outlined" name={`hasIndexData-${asset.getKey()}`} onChange={this.handleChange} value={asset.hasIndexData} />
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Account</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={asset.account}
                                                label="Account"
                                                onChange={this.handleDropChange}
                                            >
                                                <MenuItem value={'brokerage'}>Brokerage</MenuItem>
                                                <MenuItem value={'tax'}>Tax</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField label="Is Currency" id="outlined-basic" variant="outlined" name={`isCurrency-${asset.getKey()}`} onChange={this.handleChange} value={asset.isCurrency} />
                                        <Button id={asset.getKey()} onClick={this.handleDelete} variant="outlined">Delete</Button>
                                        <Button id={asset.getKey()} onClick={this.handleSave} variant="contained">Save</Button>
                                    </Stack>

                                </CardContent>
                            </Card>

                        );


                    }) : <></>}


                </>
            )
        } else {
            return (<></>);
        }

    }

}

export default AssetsView;
