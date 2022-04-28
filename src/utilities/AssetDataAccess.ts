
import { Asset } from '../model/Base/Asset';
import { API } from 'aws-amplify'
import { ListAssetsQuery } from "../API";
import { listAssets } from '../graphql/queries'
import { getCookie, setCookie } from './CookiesHelper';

export class AssetDataAccess {

    static async fetchAssetsForSelectedSim(componentState: any | null, userSimulation: string): Promise<Asset[]> {
        let fetchedAssets: Asset[] = [];
        try {
            const response = (await API.graphql({
                query: listAssets
            })) as { data: ListAssetsQuery }
            for (const asset of response.data.listAssets!.items!) {
                if (asset?.simulation === userSimulation) {
                    fetchedAssets.push(new Asset(asset!.id, asset!.ticker!, String(asset!.quantity!), asset!.hasIndexData!, asset!.account!, asset!.isCurrency!));
                }
            }
            if (componentState !== null) {
                componentState.setState({ assets: fetchedAssets })
            }
        } catch (error) {
            console.log(error);
        }
        return fetchedAssets;

    }

    static async getCrypto(entry: Asset, finnhubClient: any): Promise<number> {
        return new Promise((resolve, reject) => {
            finnhubClient.cryptoCandles(`BINANCE:${entry.ticker}USDT`, "D", Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60, Math.floor(Date.now() / 1000), (error: any, data: any, response: any) => {
                if (data && data.c && data.c.length >= 2) {
                    const value: number = data.c[1];
                    resolve(value);
                } else {
                    reject('err getCrypto')
                }
            });
        })
    }

    static async getQuotes(entry: Asset, finnhubClient: any): Promise<number> {
        return new Promise((resolve, reject) => {
            finnhubClient.quote(entry.ticker, (error: any, data: any, response: any) => {
                if (data && data.c) {
                    const value: number = data.c;
                    resolve(value);
                } else {
                    reject('err getQuotes')

                }
            });
        })
    }

}