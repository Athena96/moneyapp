import {API} from 'aws-amplify';
import {Settings} from '../model/Base/Settings';

export class SettingsService {
  static async getSettings(scenarioId: string): Promise<Settings> {
    const response = await API.get('Endpoint', '/getSettings', {
      queryStringParameters: {'scenarioId': scenarioId},
    });
    const settings = Settings.fromJson(response);
    return settings;
  }

  static async updateSettings(settings: Settings): Promise<void> {
    await API.put('Endpoint', '/updateSettings', {
      body: {
        'scenarioDataId': settings.scenarioDataId,
        'type': settings.type,
        'birthday': settings.birthday.toISOString(),
        'annualAssetReturnPercent': settings.annualAssetReturnPercent,
        'annualInflationPercent': settings.annualInflationPercent,
      },
    });
  }
}
