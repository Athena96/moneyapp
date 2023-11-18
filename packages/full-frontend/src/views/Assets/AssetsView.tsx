import React, { useState, useEffect } from 'react';
import { Asset } from '../../model/Base/Asset';
import { Button, Box, CircularProgress, TableContainer, 
    Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { AssetService } from '../../services/asset_service';
import '../../App.css';
import AssetFormDialog from './AssetFormDialog';
import Paper from '@mui/material/Paper';
import { formatCurrency } from '../../utilities/helpers';

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

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ticker</TableCell>
                            <TableCell align="right">Type</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Value</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assets.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.ticker}
                                </TableCell>
                                <TableCell align="right">{row.hasIndexData === 1 ? "stock" : "custom"}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{formatCurrency(row.price)}</TableCell>
                                <TableCell align="right">{formatCurrency(row.hasIndexData === 1 ? row.price * row.quantity : row.quantity)}</TableCell>

                                <TableCell align="center">
                                    <Button onClick={() => handleEdit(row)}>Edit</Button>
                                    <Button onClick={() => handleDelete(row)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
