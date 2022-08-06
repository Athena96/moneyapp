
import { Asset } from '../model/Base/Asset';
import { API, graphqlOperation } from 'aws-amplify'
import { ListAssetsQuery } from "../API";
import { listAssets } from '../graphql/queries'
import { createAssets } from '../graphql/mutations';
import { getCookie, setCookie } from './CookiesHelper';

export class AssetDataAccess {


    static async createAssetBranch(asset: any) {
        try {

            await API.graphql(graphqlOperation(createAssets, { input: asset }))
        } catch (err) {
            console.error('error creating asset:', err)
        }
    }

    static async paginateAssets() {
        let nxtTkn: string | null | undefined;
        let events: any = []
        do {
            const response = (await API.graphql({
                query: listAssets, variables: { nextToken: nxtTkn }
            })) as { data: ListAssetsQuery }

            for (const event of response.data.listAssets!.items!) {
                events.push(event);
            }
            nxtTkn = response.data.listAssets?.nextToken;
        } while (nxtTkn !== null);

        return events;

    }

    static async fetchAssetsForSelectedSim(componentState: any | null, userSimulation: string): Promise<Asset[]> {
        let fetchedAssets: Asset[] = [];
        try {
            const response = await AssetDataAccess.paginateAssets();
            for (const asset of response) {
                if (asset?.simulation === userSimulation) {
                    fetchedAssets.push(new Asset(asset!.id, asset!.ticker!, String(asset!.quantity!), asset!.hasIndexData!, asset!.account!, asset!.isCurrency!));
                }
            }
            if (componentState !== null) {
                componentState.setState({ assets: fetchedAssets })
            }
        } catch (error) {
            console.error(error);
        }
        return fetchedAssets;

    }

    static async getCrypto(entry: Asset, finnhubClient: any): Promise<number> {
        return new Promise((resolve, reject) => {
            const cache = getCookie(entry.ticker);
            if (cache !== null) {
                resolve(cache.getValue());
                return;
            }
            finnhubClient.cryptoCandles(`BINANCE:${entry.ticker}USDT`, "D", Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60, Math.floor(Date.now() / 1000), (error: any, data: any, response: any) => {
                if (data && data.c && data.c.length >= 2) {
                    const value: number = data.c[1];
                    setCookie(entry.ticker, String(value), 1);
                    resolve(value);
                } else {
                    reject('err getCrypto')
                }
            });
        })
    }

    static async getQuotes(entry: Asset, finnhubClient: any): Promise<number> {
        return new Promise((resolve, reject) => {
            const cache = getCookie(entry.ticker);
            if (cache !== null) {
                resolve(cache.getValue());
                return;
            }
            finnhubClient.quote(entry.ticker, (error: any, data: any, response: any) => {
                if (data && data.c) {
                    console.log(JSON.stringify(data));
                    const value: number = data.c;
                    setCookie(entry.ticker, String(value), 1);
                    resolve(value);
                } else {
                    reject('err getQuotes')

                }
            });
        })
    }

}