import * as airportJson from '../assets/airports.json';
import { IataLoader } from './iata-loader';

const airports: Map<string, any> = (airportJson as any).reduce((map: Map<string, any>, val: any) => map.set(val['iata'], val), new Map());
const airportLoader = new IataLoader('airports');
const aircraftsLoader = new IataLoader('aircrafts');

export function parseAirportCodeFromJson(code: string): string {
  const airportName = airports.get(code);
  return airportName && airportName.name ? airportName.name : code;
}
export function parseAirportCode(code: string): Promise<string> {
  return getDataFromIataCodes(airportLoader, code);
}

export async function parseAirplaneTypeCode(code: string): Promise<string> {
  const codeValue = code.slice(1);
  return getDataFromIataCodes(aircraftsLoader, codeValue);
}

async function getDataFromIataCodes(loader: IataLoader, code: string): Promise<string> {
  let name = code;
  try {
    name = await loader.load(code);
  } catch (e) {
    console.log(`Couldn't load Iata code ` + code + ' will return default value, ' + e);
  }

  return name;
}
