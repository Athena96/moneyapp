

import {API} from 'aws-amplify';
import {Recurring} from '../model/Base/Recurring';
import {ChargeType} from '../model/Base/ChargeType';


export class RecurringService {
  // static listRecurrings function
  static async listRecurring(scenarioId: string): Promise<Recurring[]> {
    const response = await API.get('Endpoint', '/listRecurring', {
      queryStringParameters: {'scenarioId': scenarioId},
    });
    return response.map((json: any) => Recurring.fromJson(json));
  }

  // static addRecurring function
  static async addRecurring(recurring: Recurring, chargeType: ChargeType): Promise<void> {
    await API.post('Endpoint', '/addRecurring', {
      body: {
        'scenarioDataId': recurring.scenarioDataId,
        'title': recurring.title,
        'startAge': recurring.startAge,
        'endAge': recurring.endAge,
        'chargeType': chargeType === ChargeType.EXPENSE ? 'EXPENSE' : 'INCOME',
        'amount': recurring.amount,
      },
    });
  }

  // updateRecurring function
  static async updateRecurring(recurring: Recurring, chargeType: ChargeType): Promise<void> {
    await API.put('Endpoint', '/updateRecurring', {
      body: {
        'scenarioDataId': recurring.scenarioDataId,
        'type': recurring.type,
        'title': recurring.title,
        'startAge': recurring.startAge,
        'endAge': recurring.endAge,
        'chargeType': chargeType === ChargeType.EXPENSE ? 'EXPENSE' : 'INCOME',
        'amount': recurring.amount,
      },
    });
  }

  // static deleteRecurring function
  static async deleteRecurring(recurring: Recurring): Promise<void> {
    await API.del('Endpoint', '/deleteRecurring', {
      body: {
        'scenarioDataId': recurring.scenarioDataId,
        'type': recurring.type,
      },
    });
  }
}
