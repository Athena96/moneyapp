import * as React from 'react';

import {
    Box, List, ListItem, Typography
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { Asset } from '../../../model/Base/Asset';
import { AssetDataAccess } from '../../../utilities/AssetDataAccess';

import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { black } from '../../../utilities/constants';

interface AssetViewComponentProps {
    simulationId: string | undefined;

}

interface IState {
    assets: Asset[] | undefined
    prices: {
        [key: string]: number
    } | undefined,
}

class AssetViewComponent extends React.Component<AssetViewComponentProps, IState> {

    constructor(props: AssetViewComponentProps) {

        super(props);

        this.state = {
            assets: undefined,
            prices: undefined,

        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
    }

    async componentDidMount() {
        if (this.props.simulationId) {
            // get assets
            const assets = await AssetDataAccess.fetchAssetsForSelectedSim(this.props.simulationId);

            // get prices
            let prices: { [key: string]: number } = {}
            for (const asset of assets) {
                if (asset.hasIndexData === 1) {
                    if (asset.isCurrency === 1) {
                        const price = 100
                        prices[asset.ticker] = price
                    } else {
                        const price = 100
                        prices[asset.ticker] = price
                    }
                }
            }
            this.setState({ assets, prices })
        }
    }

    render() {
        if (this.state.assets && this.state.prices) {
            return (
                <Box>
                    <h3 style={{ color: black, width: 'min-width' }}>Stocks<Tooltip title={`These are the securities you're invested in.`}><InfoIcon /></Tooltip></h3>

                    <List>
                        {this.state.assets.filter((asset) => asset.hasIndexData === 1 && asset.isCurrency === 0).map((asset: Asset) => {
                            const txt = `${asset.ticker}`
                            const price = `$${this.state.prices![asset.ticker]}`
                            return (
                                <ListItem divider>
                                    <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography style={{ float: 'left', marginRight: '15px' }} variant="body1" color={"text.primary"} >{txt}</Typography>
                                        <Typography style={{ float: 'right' }} variant="body2" color={"text.secondary"}>{price}</Typography>
                                    </Box>
                                </ListItem>
                            )
                        })}
                        {this.state.assets.filter((asset) => asset.hasIndexData === 1 && asset.isCurrency === 1).length > 0 && <h3 style={{ color: black, width: 'min-width' }}>Currencies<Tooltip title={`These are the currencies you're invested in.`}><InfoIcon /></Tooltip></h3>
                        }
                        {this.state.assets.filter((asset) => asset.hasIndexData === 1 && asset.isCurrency === 1).map((asset: Asset) => {
                            const txt = `${asset.ticker}`
                            const price = `$${this.state.prices![asset.ticker]}`
                            return (
                                <ListItem divider>
                                    <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography style={{ float: 'left', marginRight: '15px' }} variant="body1" color={"text.primary"} >{txt}</Typography>
                                        <Typography style={{ float: 'right' }} variant="body2" color={"text.secondary"}>{price}</Typography>
                                    </Box>
                                </ListItem>
                            )
                        })}
                    </List>
                </Box>
            );
        } else {
            return (<CircularProgress />)
        }
    }
};

export default AssetViewComponent;