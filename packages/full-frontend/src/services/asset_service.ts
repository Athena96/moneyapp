import {API} from 'aws-amplify';
import {Asset} from '../model/Base/Asset';


export class AssetService {
  // static listAssets function
  static async listAssets(scenarioId: string): Promise<Asset[]> {
    const response = await API.get('Endpoint', '/listAssets', {
      queryStringParameters: {'scenarioId': scenarioId},
    });
    return response.map((json: any) => Asset.fromJson(json));
  }

  // static addAsset function
  static async addAsset(asset: Asset): Promise<void> {
    await API.post('Endpoint', '/addAsset', {
      body: {
        'scenarioId': asset.scenarioDataId.split('#')[1],
        'ticker': asset.ticker,
        'quantity': asset.quantity,
        'hasIndexData': asset.hasIndexData,
      },
    });
  }

  // updateAsset function
  static async updateAsset(asset: Asset): Promise<void> {
    await API.put('Endpoint', '/updateAsset', {
      body: {
        'scenarioDataId': asset.scenarioDataId,
        'type': asset.type,
        'ticker': asset.ticker,
        'quantity': asset.quantity,
        'hasIndexData': asset.hasIndexData,
      },
    });
  }

  // static deleteAsset function
  static async deleteAsset(asset: Asset): Promise<void> {
    await API.del('Endpoint', '/deleteAsset', {
      body: {
        'scenarioDataId': asset.scenarioDataId,
        'type': asset.type,
      },
    });
  }
}
