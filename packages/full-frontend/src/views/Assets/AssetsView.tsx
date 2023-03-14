import * as React from 'react';

import { Asset } from '../../model/Base/Asset';
import { Simulation } from '../../model/Base/Simulation';
import { AssetDataAccess } from '../../utilities/AssetDataAccess';
import { cleanNumberDataInput } from '../../utilities/helpers';

import { Button, Box } from '@mui/material';

import { Link } from "react-router-dom";
import AssetComponent from './components/AssetComponent';
import AddAssetComponent from './components/AddAssetComponent';


export type AssetData = {
    asset: Asset
    adding: boolean
}

interface AssetsViewProps {
    user: string;
    simulation: Simulation | undefined;
}

interface IState {
    assets: AssetData[]
}

class AssetsView extends React.Component<AssetsViewProps, IState> {

    constructor(props: AssetsViewProps) {

        super(props);

        this.state = {
            assets: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAddAsset = this.handleAddAsset.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDeleteAsset = this.handleDeleteAsset.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.setHasIndexData = this.setHasIndexData.bind(this);
        this.render = this.render.bind(this);
    }

    async componentDidMount() {
        if (this.props.simulation) {
            const assets: Asset[] = await AssetDataAccess.fetchAssetsForSelectedSim(this.props.simulation.getKey());
            const assetData: AssetData[] = []
            for (const asset of assets) {
                assetData.push({
                    asset,
                    adding: false
                })
            }
            this.setState({ assets: assetData })
        }
    }

    async handleAddAsset() {
        try {
    
            const newAsset = new Asset(new Date().getTime().toString(), "...", 0, 1, 0, this.props.simulation!.id);
            const newAssets = [...this.state.assets, { asset: newAsset, adding: true }]
            this.setState({ assets: newAssets });
            await AssetDataAccess.createAsset(newAsset);
        } catch (err) {
            console.error('error creating todo:', err)
        }
    }

    async handleDeleteAsset(event: any) {
        const idToDelete = (event.target as Element).id;
        if (window.confirm('Are you sure you want to DELETE this Asset?')) {
            let newAssets = [];
            let assetIdToDelete = null;

            for (const asset of this.state.assets) {
                if (asset.asset.getKey() === idToDelete) {
                    assetIdToDelete = asset.asset.getKey()
                    continue;
                }
                newAssets.push(asset);
            }
            this.setState({ assets: newAssets });
    
            await AssetDataAccess.deleteAsset(assetIdToDelete!)
        }
    }

    async handleSave(e: any) {
        const id = e.target.id;
        const assetDataToUpdate = this.getAssetToSave(id);
        if (assetDataToUpdate) {
            console.log('herre')
            console.log(JSON.stringify(assetDataToUpdate.asset))
            await AssetDataAccess.updateAsset(assetDataToUpdate.asset);
        }
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        const assts = this.state.assets;
        const tp = name.split('-')[0];
        const key = name.split('-')[1];

        for (const asset of assts) {

            if (asset.asset.getKey() === key) {
                if (tp === 'ticker') {
                    asset.asset.ticker = value;
                }
                if (tp === 'quantity') {
                    asset.asset.setQuantity(cleanNumberDataInput(value));
                }
                if (tp === 'hasIndexData') {
                    asset.asset.hasIndexData = Number(value);
                }
                // if (tp === 'isCurrency') {
                //     asset.isCurrency = Number(value);
                // }
            }
        }
        this.setState({ assets: assts });

    }

    getAssetToSave(id: string) {
        for (const i of this.state.assets) {
            if (i.asset.getKey() === id) {
                return i;
            }
        }
    }

    setHasIndexData(event: React.MouseEvent<HTMLDivElement> | undefined, has: boolean, assetToAdd: Asset) {
        let currAssets = this.state.assets;
        for (const asset of currAssets) {
            if (asset.asset.id === assetToAdd.id) {
                asset.asset.hasIndexData = has ? 1 : 0;
                break;
            }
        }
        this.setState({ assets: currAssets });
    }

    handleCheckBox(assetToUpdate: Asset) {
        const assets = this.state.assets;
        for (const asset of assets) {
            if (asset.asset.id === assetToUpdate.id) {
                let newHasIndexData = asset.asset.hasIndexData === 1 ? 0 : 1;
                asset.asset.hasIndexData = newHasIndexData;
            }
        }
        this.setState({ assets: assets })
    }

    render() {
        if (this.props.simulation) {
            return (
                <Box >
                    <h1 >Assets</h1>
                    {this.state.assets ? this.state.assets.map((asset: AssetData, i: number) => {

                        if (asset.adding) {
                            return (
                                <AddAssetComponent asset={asset.asset} handleChange={this.handleChange} handleDeleteAsset={this.handleDeleteAsset} handleSave={this.handleSave} setHasIndexData={this.setHasIndexData} />
                            );
                        } else {
                            return (
                                <AssetComponent asset={asset.asset} handleChange={this.handleChange} handleDeleteAsset={this.handleDeleteAsset} handleSave={this.handleSave} handleCheckBox={this.handleCheckBox} />
                            );
                        }

                    }) : <></>}
                    <br />
                    <Button style={{ width: "100%" }} onClick={this.handleAddAsset} variant="outlined">add assets +</Button>
                    <br />
                    <br />

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

export default AssetsView;
