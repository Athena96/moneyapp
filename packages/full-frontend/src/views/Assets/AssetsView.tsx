import React, {useState, useEffect} from 'react';
import {Asset} from '../../model/Base/Asset';
import {Button, CircularProgress, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import {AssetService} from '../../services/asset_service';
import '../../App.css';
import AssetFormDialog from './AssetFormDialog';
import Paper from '@mui/material/Paper';
import {formatCurrency} from '../../utilities/helpers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface AssetsViewProps {
    user: string;
    scenarioId: string;
}

const AssetsView: React.FC<AssetsViewProps> = ({user, scenarioId}) => {
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
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleAdd = async () => {
    setSelectedAsset(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const saveAsset = async (asset: Asset) => {
    if (selectedAsset) {
      await AssetService.updateAsset(asset);
      setAssets(assets.map((a) => (a.id === asset.id ? asset : a)));
    } else {
      await AssetService.addAsset(asset);
      setAssets([...assets, asset]);
    }
  };

  if (isLoading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div style={{textAlign: 'center'}}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="outlined" style={{
        width: '100%',
        marginBottom: '20px'}}
      disabled={isLoading} onClick={handleAdd}>add assets</Button>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
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
            {assets.map((row) => {
              const value = formatCurrency(row.hasIndexData === 1 ? row.price * row.quantity : row.quantity);
              return (
                <TableRow
                  key={row.id}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell component="th" scope="row">
                    {row.ticker}
                  </TableCell>
                  <TableCell align="right">{row.hasIndexData === 1 ? 'stock' : 'custom'}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(row.price)}</TableCell>
                  <TableCell align="right">{value}</TableCell>

                  <TableCell align="center">
                    <Button onClick={() => handleEdit(row)}><EditIcon/></Button>
                    <Button onClick={() => handleDelete(row)}><DeleteIcon/></Button>
                  </TableCell>
                </TableRow>
              );
            })}
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
    </div>

  );
};

export default AssetsView;
