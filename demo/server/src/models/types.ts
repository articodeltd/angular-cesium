export interface Query {
  tracks: Array<Track> | null;
}

export interface TracksQueryArgs {
  bounds: BoundsInput | null;
}

export interface BoundsInput {
  start: PositionInput | null;
  end: PositionInput | null;
}

export interface PositionInput {
  lat: number | null;
  long: number | null;
}

export interface Track {
  id: string | null;
  flightNumber: string | null;
  callsign: string | null;
  from: string | null;
  to: string | null;
  heading: number | null;
  position: Position | null;
  groundSpeed: number | null;
  type: string | null;
}

export interface Position {
  lat: number | null;
  long: number | null;
  alt: number | null;
}
