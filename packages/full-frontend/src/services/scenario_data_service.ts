

import {API} from 'aws-amplify';
import {Asset} from '../model/Base/Asset';
import {Recurring} from '../model/Base/Recurring';
import {Settings} from '../model/Base/Settings';
import {ScenarioData} from '../model/Base/ScenarioData';


export class ScenarioDataService {
  static async getScenarioData(scenarioId: string): Promise<ScenarioData> {
    const response = await API.get('Endpoint', '/getScenarioData', {
      queryStringParameters: {'scenarioId': scenarioId},
    });
    const assets: Asset[] = response['assets'].map((json: any) => Asset.fromJson(json));
    const recurrings: Recurring[] = response['recurrings'].map((json: any) => Recurring.fromJson(json));
    const settings: Settings = Settings.fromJson(response['settings']);
    return new ScenarioData(settings, assets, recurrings);
  }
}
