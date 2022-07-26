import { FC } from 'react';

import {
    Card, CardContent, TextField, MenuItem, FormControl, Button, Checkbox,
    FormControlLabel, InputLabel, Select, Stack, SelectChangeEvent
} from '@mui/material';
import { Asset } from '../../../model/Base/Asset';
import { Account } from '../../../model/Base/Account';

interface AssetComponentProps {
    asset: Asset
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleDropChange: (event: SelectChangeEvent) => void
    accounts: Account[]
    handleDeleteAsset: (event: any) => Promise<void>
    handleSave: (e: any) => Promise<void>
    handleCheckBox: (assetToUpdate: Asset) => void
}

const AssetComponent: FC<AssetComponentProps> = ({ asset, handleChange, handleDropChange, accounts, handleDeleteAsset, handleSave, handleCheckBox }) => {
    return (
        <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
            <CardContent>
                <Stack direction='column' spacing={2}>
                    <TextField label="Ticker Code / Asset Name" id="outlined-basic" variant="outlined" name={`ticker-${asset.getKey()}`} onChange={handleChange} value={asset.ticker} />
                    <TextField label="Quantity / Total value" id="outlined-basic" variant="outlined" name={`quantity-${asset.getKey()}`} onChange={handleChange} value={asset.strQuantity} />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Account</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name={asset.id}
                            value={asset.account}
                            label="Account"
                            onChange={handleDropChange}
                        >
                            {accounts.map((account: Account, z: number) => {
                                return (
                                    <MenuItem key={z} value={account.name}>{account.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    {/* <TextField label="Is Currency" id="outlined-basic" variant="outlined" name={`isCurrency-${asset.getKey()}`} onChange={this.handleChange} value={asset.isCurrency} /> */}

                    <FormControlLabel control={<Checkbox name={`use-online-data`} onChange={(e) => handleCheckBox(asset)} checked={asset.hasIndexData === 1 ? true : false} />} label="Is this an asset who's value is publicly available? (i.e. a Stock/Fund on the publicly traded market?)" />
                    <Button id={asset.getKey()} onClick={handleDeleteAsset} variant="outlined">Delete</Button>
                    <Button id={asset.getKey()} onClick={handleSave} variant="contained">Save</Button>
                </Stack>

            </CardContent>
        </Card>

    );
};


export default AssetComponent;