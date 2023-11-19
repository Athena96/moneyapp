

import {API} from 'aws-amplify';
import {Scenario} from '../model/Base/Scenario';


export class ScenarioService {
  static async listScenarios(): Promise<Scenario[]> {
    const response = await API.get('Endpoint', '/listScenarios', {});
    return response.map((json: any) => Scenario.fromJson(json));
  }
}
