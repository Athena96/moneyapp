import {API} from 'aws-amplify';

export class AccountService {
  // static deleteAccount function
  static async deleteAccount(): Promise<void> {
    console.log('deleteAccount');

    const response = await API.del('Endpoint', '/deleteAccount', {
    });
    console.log(response);
  }
}
