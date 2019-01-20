import * as rp from 'request-promise';
import { Track, TracksQueryArgs } from '../models/types';
import { parseToTrack } from './track-data-parser';
import { parseAirplaneTypeCode, parseAirportCode, parseAirportCodeFromJson } from './iata-codes-parser';

export const resolverMap = {
  Query : {
    async tracks(obj: any, args: TracksQueryArgs) {
      const bounds = args.bounds;
      const boundsStr = bounds ? `bounds=${bounds.start.lat},${bounds.start.long},${bounds.end.lat},${bounds.end.long}` : '';

      const data = await rp({
        uri : `https://data-live.flightradar24.com/zones/fcgi/feed.js?${boundsStr}
                &faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=7200&gliders=1&stats=1`,
        json : true // Automatically parses the JSON string in the response
      });

      return Object.keys(data).slice(2, -1).map((key) => parseToTrack(data[key], key));
    },
    async track(obj: any, args: {id: string}) {
      const id = args.id;
      const data = await rp({
        uri : `https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=10,10,10,10
                &estimated=1&maxage=7200stats=1&selected=${id}&ems=1`,
        json : true // Automatically parses the JSON string in the response
      });

      const trackData = data[id];
      return trackData ? parseToTrack(data[id], id) : null;
    }
  }
};

export const trackResolver = {
  Track: {
    from(track: Track) {
      return parseAirportCodeFromJson(track.from);
    },
    to(track: Track) {
      return parseAirportCodeFromJson(track.to);
    },
    async type(track: Track){
      return parseAirplaneTypeCode(track.type);
    }
  }
};
