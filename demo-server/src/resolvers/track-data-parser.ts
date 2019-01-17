import { Track } from '../models/types';

const degreesToRadians = (degrees: number) => {
	return (degrees * Math.PI) / 180.0;
};

export function parseToTrack(dataArray: any[], keyId: string): Track {
	const modeScode = dataArray[0];
	const lat = dataArray[1];
	const long = dataArray[2];
	const heading = dataArray[3]; // degree
	const alt = dataArray[4];
	const groundSpeed = dataArray[5];
	const type = dataArray[8];
	const from = dataArray[11];
	const to = dataArray[12];
	const callsign = dataArray[16];
	const flightNumber = dataArray[13];

	const position = { lat, long, alt };
	return {
		id: keyId,
		flightNumber,
		type,
		from,
		to,
		callsign,
		heading: degreesToRadians(heading),
		position,
		groundSpeed,
	};
}
