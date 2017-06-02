declare module "geodesy" {
    export class Utm {
        constructor(zone, hemisphere, easting, northing)
        toLatLonE();
    }

    export class LatLonEllipsoidal {
        constructor(latitude, longitude, undefined, height);
        toUtm();
    }
}