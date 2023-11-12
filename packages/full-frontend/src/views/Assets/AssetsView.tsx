import React, { useState, useEffect } from 'react';
import { Asset } from '../../model/Base/Asset';
import { Button, Box, Stack, Card, CircularProgress } from '@mui/material';
import AssetComponent from './AssetComponent';
import { AssetService } from '../../services/asset_service';
import '../../App.css';
import AssetFormDialog from './AssetFormDialog';
import EditAssetDialog from './EditAssetDialog';
import { set } from 'date-fns';

interface AssetsViewProps {
    user: string;
    scenarioId: string;
}

const AssetsView: React.FC<AssetsViewProps> = ({ user, scenarioId }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchAssets = async () => {
            const assets: Asset[] = await AssetService.listAssets(scenarioId);
            setAssets(assets);
            setIsLoading(false);
        };
        fetchAssets();
    }, []);


    const handleDelete = async (asset: Asset) => {
        await AssetService.deleteAsset(asset);
        const newAssets = assets.filter((a: Asset) => a.id !== asset.id);
        setAssets(newAssets);
    };

    const handleEdit = (asset: Asset) => {
        setSelectedAsset(asset)
        setIsDialogOpen(true)
    }

    const handleAdd = async () => {
        setSelectedAsset(null)
        setIsDialogOpen(true)
    }

    const closeDialog = () => {
        setIsDialogOpen(false);
    }

    const saveAsset = async (asset: Asset) => {
        if (selectedAsset) {
            await AssetService.updateAsset(asset);
            setAssets(assets.map(a => (a.id === asset.id ? asset : a)))
        } else {
            await AssetService.addAsset(asset);
            setAssets([...assets, asset])
        }
    }

    return (
        <Box>
            <h1>Assets</h1>
            <Button disabled={isLoading} style={{ width: "100%" }} onClick={handleAdd} variant="outlined">add assets +</Button>
            {isLoading &&
                <>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <div style={{ textAlign: "center" }}>
                            <CircularProgress />
                        </div>
                    </div>
                </>}
            {assets.map((asset: Asset, i: number) => {
                return (
                    <Card key={i} variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                        <AssetComponent
                            key={i}
                            asset={asset}
                        />
                        <Button style={{ margin: "10px" }} variant="outlined" onClick={() => handleDelete(asset)}>Delete</Button>
                        <Button style={{ margin: "10px" }} variant="contained" onClick={() => handleEdit(asset)}>Edit</Button>
                    </Card>
                );
            })}

            <AssetFormDialog
                user={user}
                scenarioId={scenarioId}

                isOpen={isDialogOpen}
                onClose={closeDialog}
                onSave={saveAsset}
                initialAsset={selectedAsset || undefined}
            />
        </Box>
    );
};

export default AssetsView;
