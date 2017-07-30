export default `
schema {
    query: Query
}

type Query {
    tracks(bounds: BoundsInput): [Track]
    track(id: String!): Track
}

type Track {
    id: ID 
    flightNumber: String
    callsign: String
    from: String
    to: String
    heading: Float # degrees
    position: Position
    groundSpeed: Int # kts
    type: String # aircraft type code
}

type Position {
    lat: Float
    long: Float
    alt: Float # feet
}

input PositionInput {
    lat: Float
    long: Float
}

input BoundsInput {
    start: PositionInput
    end: PositionInput
}

`;
