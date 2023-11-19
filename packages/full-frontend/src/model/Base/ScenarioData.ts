import {Asset} from './Asset';
import {Recurring} from './Recurring';
import {Settings} from './Settings';

export class ScenarioData {
  settings: Settings;
  assets: Asset[];
  recurrings: Recurring[];

  constructor(
      settings: Settings,
      assets: Asset[],
      recurrings: Recurring[],
  ) {
    this.settings = settings;
    this.assets = assets;
    this.recurrings = recurrings;
  }
}
