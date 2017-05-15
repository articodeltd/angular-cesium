import * as rp from 'request-promise';
import * as DataLoader from 'dataloader';
import * as airportJson from '../assets/airports.json';

const airports: Map<string, any> = (airportJson as any).reduce((map: Map<string, any>, val) => map.set(val['iata'], val), new Map());

export function parseAirportCodeFromJson(code: string): string {
  const airportName = airports.get(code);
  return airportName ? airportName.name : null;
}
export async function parseAirportCode(code: string): Promise<string> {
  return getDataFromIataCodes('airports', code);
}

export function parseAirplaneTypeCode(code: string): Promise<string> {
  return getDataFromIataCodes('aircrafts', code.slice(1));
}

const API_KEY = '1cc7eb2c-713a-4040-9a7c-da046d68cc29';
async function getDataFromIataCodes(type: string, code?: string): Promise<string> {
  // TODO save it in cache
  const uri = `https://iatacodes.org/api/v6/${type}.json?code=${code}&api_key=${API_KEY}`;
  let result = null;
  try {
    result = await rp({
      uri,
      json : true,
      strictSSL : false
    });
  } catch (e) {
    console.log('iata code error:' + e);
  }

  return result && result.response && result.response.length ? result.response[0].name : code;
}
