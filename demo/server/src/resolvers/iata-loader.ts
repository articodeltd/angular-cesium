import * as rp from 'request-promise';
import * as DataLoader from 'dataloader';

const API_KEY = '1cc7eb2c-713a-4040-9a7c-da046d68cc29';
export class IataLoader {
  private loader: DataLoader<any,any>;

  constructor(private type: string) {
    this.loader = new DataLoader((codes) => {
      return Promise.all(codes.map((code) => this.getDataFromIataCodes(this.type, code as string)));
    });
  }

  load(code: string): Promise<string> {
    return this.loader.load(code);
  }

  clear(code: string) {
    this.loader.clear(code);
  }

  private async getDataFromIataCodes(type: string, code?: string): Promise<string | Error> {
    const uri = `https://iatacodes.org/api/v6/${type}.json?code=${code}&api_key=${API_KEY}`;
    const result = await rp({
      uri,
      json : true,
      strictSSL : false
    });

    if (result && result.response && result.response.length) {
      return result.response[0].name;
    } else if (result && result.response && !result.response.length) {
      return new Error('Value cant be resolved by Iata API');
    } else {
      // tslint:disable-next-line
      throw 'Filed to get The code';
    }
  }
}