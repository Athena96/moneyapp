
import { Asset } from '../model/Base/Asset';
import { API } from 'aws-amplify'
import { ListAssetsQuery } from "../API";
import { listAssets } from '../graphql/queries'
import { getCookie, setCookie } from './CookiesHelper';

export class AssetDataAccess {

    static async fetchAssets(componentState: any | null): Promise<Asset[]> {
        let fetchedAssets: Asset[] = [];
        try {
            const response = (await API.graphql({
                query: listAssets
            })) as { data: ListAssetsQuery }
            for (const asset of response.data.listAssets!.items!) {
                fetchedAssets.push(new Asset(asset!.id, asset!.ticker!, String(asset!.quantity!), asset!.hasIndexData!, asset!.account!, asset!.isCurrency!));
            }
            if (componentState !== null) {
                componentState.setState({ assets: fetchedAssets })
            }
        } catch (error) {
            console.log(error);
        }
        return fetchedAssets;

    }

    static async fetchStartingBalances(componentState: any) {
        const finnhub = require('finnhub');

        const api_key = finnhub.ApiClient.instance.authentications['api_key'];
        delete finnhub.ApiClient.instance.defaultHeaders['User-Agent'];

        api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
        const finnhubClient = new finnhub.DefaultApi()

        const assets: Asset[] = await AssetDataAccess.fetchAssets(null);

        if (!componentState.state.balances['brokerage']) {
            componentState.state.balances['brokerage'] = {
                0: 0.0
            }
        }

        if (!componentState.state.balances['tax']) {
            componentState.state.balances['tax'] = {
                0: 0.0
            }
        }

        for (const entry of assets) {
            if (entry.ticker !== null && entry.hasIndexData === 1) {
                if (entry.isCurrency === 1) {

                    const cookie = getCookie(entry.ticker);
                    if (cookie) {
                        this.computeCurrentyStartingBalances(componentState, cookie.getValue(), entry);
                    } else {
                        finnhubClient.cryptoCandles(`BINANCE:${entry.ticker}USDT`, "D", Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60, Math.floor(Date.now() / 1000), (error: any, data: any, response: any) => {
                            if (data && data.c && data.c.length >= 2) {
                                const value: number = data.c[1];
                                setCookie(entry.ticker, value.toString());
                                this.computeCurrentyStartingBalances(componentState, value, entry);
                            }
                        });
                    }

                } else {
                    const stockCookie = getCookie(entry.ticker);
                    if (stockCookie && stockCookie != null) {
                        this.computeSecuritiesStartingBalances(componentState, stockCookie.getValue(), entry);
                    } else {
                        finnhubClient.quote(entry.ticker, (error: any, data: any, response: any) => {
                            if (data && data.c) {
                                const value: number = data.c;
                                setCookie(entry.ticker, value.toString());
                                this.computeSecuritiesStartingBalances(componentState, value, entry);
                            }
                        });
                    }
                }
            } else {
                const newBrokNonStock = entry.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + entry.quantity : componentState.state.balances['brokerage'][0];
                const currTaxNonStock = entry.account === 'tax' ? componentState.state.balances['tax'][0] + entry.quantity : componentState.state.balances['tax'][0];
                componentState.setState({
                    balances: {
                        brokerage: {
                            0: newBrokNonStock,

                        },
                        tax: {
                            0: currTaxNonStock,
                        }
                    }
                })
            }

        }

    }

    static computeCurrentyStartingBalances(componentState: any, currentCurrencyVal: number, asset: Asset) {
        const value: number = currentCurrencyVal;
        const holdingValue = value * asset.quantity;
        const newBrokCurr = asset.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + holdingValue : componentState.state.balances['brokerage'][0];
        const currTaxCurr = asset.account === 'tax' ? componentState.state.balances['tax'][0] + holdingValue : componentState.state.balances['tax'][0];
        componentState.setState({
            balances: {
                brokerage: {
                    0: newBrokCurr,

                },
                tax: {
                    0: currTaxCurr,
                }
            }
        })
    }

    static computeSecuritiesStartingBalances(componentState: any, currentSecurityVal: number, asset: Asset) {
        const holdingValue = currentSecurityVal * asset.quantity;
        const newBrok = asset.account === 'brokerage' ? componentState.state.balances['brokerage'][0] + holdingValue : componentState.state.balances['brokerage'][0];
        const currTax = asset.account === 'tax' ? componentState.state.balances['tax'][0] + holdingValue : componentState.state.balances['tax'][0];
        componentState.setState({
            balances: {
                brokerage: {
                    0: newBrok,

                },
                tax: {
                    0: currTax,
                }
            }
        })
    }

}