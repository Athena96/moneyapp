export class Scenario {
  readonly email: string;
  readonly active: number;
  readonly scenarioId: string;
  readonly title: string;

  constructor(email: string, active: number, scenarioId: string, title: string) {
    this.email = email;
    this.active = active;
    this.scenarioId = scenarioId;
    this.title = title;
  }

  // Static method to create a Scenario object from a JSON object
  static fromJson(json: any): Scenario {
    return new Scenario(
        json['email'],
        parseInt(json['active'], 10),
        json['scenarioId'],
        json['title'],
    );
  }

  // Static method to find the active Scenario in a list of Scenarios
  static getActiveScenario(scenarios: Scenario[]): Scenario {
    const activeScenario = scenarios.find((scenario) => scenario.active === 1);
    if (!activeScenario) {
      throw new Error('No active scenario found');
    }
    return activeScenario;
  }

  // Method to get a string representation of the Scenario object
  toString(): string {
    return `Scenario(
      email: ${this.email}, 
      active: ${this.active}, 
      scenarioId: ${this.scenarioId}, 
      title: ${this.title})`;
  }
}
