import * as rp from 'request-promise';

const API_KEY = '1cc7eb2c-713a-4040-9a7c-da046d68cc29';

export async function parseAirportCode(code: string): Promise<string> {
  return getDataFromIataCodes('airports', code);
}

export function parseAirplaneTypeCode(code: string) {
  return getDataFromIataCodes('aircrafts', code.slice(1));
}


async function getDataFromIataCodes(type: string, code?: string): Promise<string> {
  const uri = `https://iatacodes.org/api/v6/${type}.json?code=${code}&api_key=${API_KEY}`;
  console.log(uri);
  const result = await rp({
    uri,
    json : true,
    strictSSL : false
  });
  return result && result.response && result.response.length ? result.response[0].name : code;
}
