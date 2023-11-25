

import {API} from 'aws-amplify';
import {Scenario} from '../model/Base/Scenario';


export class ScenarioService {
  static async listScenarios(): Promise<Scenario[]> {
    const response = await API.get('Endpoint', '/listScenarios', {});
    return response.map((json: any) => Scenario.fromJson(json));
  }

  static async getActiveScenario(): Promise<Scenario> {
    const scenarios = await this.listScenarios();
    // filter to get the active scenario
    const activeScenario = scenarios.filter((scenario) => scenario.active === 1);
    if (activeScenario.length === 0) {
      throw new Error('No active scenario found');
    }
    return activeScenario[0];
  }

  static async addScenario(scenario: Scenario): Promise<void> {
    await API.post('Endpoint', '/addScenario', {
      body: {
        'title': scenario.title,
      },
    });
  }

  static async updateScenario(scenario: Scenario): Promise<void> {
    await API.put('Endpoint', '/updateScenario', {
      body: {
        'title': scenario.title,
        'scenarioId': scenario.scenarioId,
        'active': scenario.active,
      },
    });
  }


  // static async changeActiveScenario(scenario: Scenario): Promise<void> {
  //   await API.put('Endpoint', '/changeActiveScenario', {
  //     body: {
  //       'idOfNewActiveScenario': scenario.scenarioId,
  //     },
  //   });
  // }

  static async deleteScenario(scenario: Scenario): Promise<void> {
    await API.del('Endpoint', '/deleteScenario', {
      body: {
        'scenarioId': scenario.scenarioId,
      },
    });
  }
}
