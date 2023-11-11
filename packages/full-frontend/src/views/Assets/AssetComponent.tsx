import { FC } from 'react';

import {
    Card, CardContent, Button, Checkbox,
    FormControlLabel, Stack
} from '@mui/material';
import { Asset } from '../../model/Base/Asset';
import BusinessIcon from '@mui/icons-material/Business';
import InsertChartIcon from '@mui/icons-material/InsertChart';

interface AssetComponentProps {
    asset: Asset
}


const AssetComponent: FC<AssetComponentProps> = ({ asset }) => {
    return (
            <CardContent>
                <p>{asset.hasIndexData === 1 ? <BusinessIcon/> : <InsertChartIcon/>}{' '}<b>{asset.hasIndexData === 1 ? "Stock/ETF" : "Custom Asset"}</b></p>
                <Stack direction='column' spacing={2}>
                    <h3>Ticker: {asset.ticker}</h3>
                    <p>Quantity: {asset.quantity}</p>
                    <p>Value: ${(asset.hasIndexData === 1 ? asset.price*asset.quantity : asset.quantity).toFixed(2)}</p>
                </Stack>
            </CardContent>


    );
};


export default AssetComponent;