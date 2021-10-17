
import { Asset } from '../model/Asset';
import { API } from 'aws-amplify'
import { ListAssetsQuery } from "../API";
import { listAssets } from '../graphql/queries'

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

}