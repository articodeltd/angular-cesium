import * as rp from 'request-promise';
import { TracksQueryArgs } from '../models/types';
import { parseToTrack } from './trackDataParser';

export const resolverMap = {
  Query : {
    async tracks(obj, args: TracksQueryArgs) {
      const bounds = args.bounds;
      const boundsStr = bounds ? `bounds=${bounds.start.lat},${bounds.start.long},${bounds.end.lat},${bounds.end.long}` : '';
      
      const data = await rp({
        uri : `https://data-live.flightradar24.com/zones/fcgi/feed.js?${boundsStr}&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=7200&gliders=1&stats=1`,
        json : true // Automatically parses the JSON string in the response
      });
      
      return Object.keys(data).slice(2, -1).map((key) => parseToTrack(data[key], key));
    },
  }
};