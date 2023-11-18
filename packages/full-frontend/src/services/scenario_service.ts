

import { API } from "aws-amplify";
import { Asset } from "../model/Base/Asset";
import { Recurring } from "../model/Base/Recurring";
import { Settings } from "../model/Base/Settings";
import { ScenarioData } from "../model/Base/ScenarioData";
import { Scenario } from "../model/Base/Scenario";


export class ScenarioService {

  static async listScenarios(): Promise<Scenario[]> {
    const response = await API.get('Endpoint', '/listScenarios', {});
    return response.map((json: any) => Scenario.fromJson(json));
  }
  
}