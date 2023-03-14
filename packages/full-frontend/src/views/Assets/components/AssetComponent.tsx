import { FC } from 'react';

import {
    Card, CardContent, TextField, Button, Checkbox,
    FormControlLabel, Stack
} from '@mui/material';
import { Asset } from '../../../model/Base/Asset';
import BusinessIcon from '@mui/icons-material/Business';
import InsertChartIcon from '@mui/icons-material/InsertChart';

interface AssetComponentProps {
    asset: Asset
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleDeleteAsset: (event: any) => Promise<void>
    handleSave: (e: any) => Promise<void>
    handleCheckBox: (assetToUpdate: Asset) => void
}

const AssetComponent: FC<AssetComponentProps> = ({ asset, handleChange, handleDeleteAsset, handleSave, handleCheckBox }) => {
    return (
        <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
            <CardContent>
                <p>{asset.hasIndexData === 1 ? <BusinessIcon/> : <InsertChartIcon/>}{' '}<b>{asset.hasIndexData === 1 ? "Stock/ETF" : "Custom Asset"}</b></p>
                <Stack direction='column' spacing={2}>
                    <TextField label={asset.hasIndexData === 1 ? "Ticker Code" : "Asset Name"} id="outlined-basic" variant="outlined" name={`ticker-${asset.getKey()}`} onChange={handleChange} value={asset.ticker} />
                    <TextField label={asset.hasIndexData === 1 ? "Quantity" : "Current Value (in Dollars)"} id="outlined-basic" variant="outlined" name={`quantity-${asset.getKey()}`} onChange={handleChange} value={asset.quantity} />
                    <FormControlLabel control={<Checkbox name={`use-online-data`} onChange={(e) => handleCheckBox(asset)} checked={asset.hasIndexData === 1 ? true : false} />} label="Is this an asset who's value is publicly available? (i.e. a Stock/Fund on the publicly traded market?)" />
                    <Button id={asset.getKey()} onClick={handleDeleteAsset} variant="outlined">Delete</Button>
                    <Button id={asset.getKey()} onClick={handleSave} variant="contained">Save</Button>
                </Stack>

            </CardContent>
        </Card>

    );
};


export default AssetComponent;