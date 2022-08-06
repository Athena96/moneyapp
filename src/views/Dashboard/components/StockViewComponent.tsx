import * as React from 'react';

import {
    Box, List, ListItem, Typography
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { Asset } from '../../../model/Base/Asset';
import { AssetDataAccess } from '../../../utilities/AssetDataAccess';
import { getFinnhubClient } from '../../../utilities/helpers';

interface StockViewComponentProps {
    simulationId: string | undefined;

}

interface IState {
    assets: Asset[] | undefined
    prices: {
        [key: string]: number
    } | undefined,
    finnhubClient: any

}

class StockViewComponent extends React.Component<StockViewComponentProps, IState> {

    constructor(props: StockViewComponentProps) {

        super(props);

        this.state = {
            assets: undefined,
            prices: undefined,
            finnhubClient: getFinnhubClient()
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.render = this.render.bind(this);
    }

    async componentDidMount() {
        if (this.props.simulationId) {
            // get assets
            const assets = await AssetDataAccess.fetchAssetsForSelectedSim(null, this.props.simulationId);

            // get prices
            let prices: { [key: string]: number } = {}
            for (const asset of assets) {
                if (asset.hasIndexData === 1) {
                    if (asset.isCurrency === 1) {
                        const price = await AssetDataAccess.getCrypto(asset, this.state.finnhubClient)
                        prices[asset.ticker] = price
                    } else {
                        const price = await AssetDataAccess.getQuotes(asset, this.state.finnhubClient)
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
                    <List>
                        {this.state.assets.filter((asset) => asset.hasIndexData === 1).map((asset: Asset) => {
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

export default StockViewComponent;