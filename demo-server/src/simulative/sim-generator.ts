import { SimClient } from './sim-client';

const INTERVAL_DIVIDER = 10;
const getSign = () => Math.round(Math.random()) * 2 - 1;

export class SimGenerator {

  constructor(private client: SimClient) {
  }

  get maxMovementDistance() {
    return 0.08 * this.client.intervalMs / 1000;
  }

  get maxHeadingChange() {
    return Math.PI / 4 * this.client.intervalMs / 1000;
  }

  get maxAltitudeChange() {
    return 200 * this.client.intervalMs / 1000;
  }

  get chanceToChangeDirection() {
    return 0.10 * this.client.intervalMs / 1000;
  }

  createSimData(): Array<any> {
    const data = [];
    for (let i = 0; i < this.client.numOfEntities; i++) {
      const position = {
        lat: 70 * Math.random() * getSign(),
        long: 180 * Math.random() * getSign(),
        altitude: 50000 * Math.random()
      };
      const heading = Math.random() * 2 * Math.PI;
      const futurePosition = this.getFuturePosition(position, heading);
      data.push({
        id: i,
        action: 'ADD_OR_UPDATE',
        entity: {
          id: i,
          isTarget: i % 2 === 0,
          callsign: 'track' + i,
          image: '/assets/fighter-jet.png',
          heading,
          position,
          futurePosition
        }
      });
    }
    this.client.simData = data;
    return data;
  }

  restart() {
    clearInterval(this.client.intervalId);

    this.createSimData();
    this.startSendingSimData();
  }


  startSendingSimData() {
    const simData = this.client.simData;
    let counter = 0;
    const id = setInterval(() => {
      let dataChunk = simData;
      if (this.client.numOfEntities <= 100 || counter % INTERVAL_DIVIDER === 0) {
        counter = 0;
        dataChunk = this.updateChunk(simData);
        this.client.simData = dataChunk;
      }

      const chunk = this.client.numOfEntities > 100 ?
        this.getChunkPart(counter) : dataChunk;
      this.client.socket.emit('birds', chunk);
      counter++;
    }, this.client.numOfEntities <= 100 ? this.client.intervalMs : this.client.intervalMs / INTERVAL_DIVIDER);
    this.client.intervalId = id;
    return id;
  }

  private getChunkPart(part: any) {
    const simData = this.client.simData;
    const numOfEntities = this.client.numOfEntities;
    const result = [];
    const maxIndex = Math.floor(numOfEntities / INTERVAL_DIVIDER) * (part + 1);
    for (let i = Math.floor(numOfEntities / INTERVAL_DIVIDER) * part; i < maxIndex; i++) {
      result.push(simData[i]);
    }
    return result;
  }

  private getFuturePosition(position: any, heading: number) {
    return {
      lat: position.lat + Math.cos(heading) * this.maxMovementDistance * 30,
      long: position.long + Math.sin(heading) * this.maxMovementDistance * 30,
      altitude: position.altitude
    };
  }

  private updateChunk(dataArr: any) {
    for (let i = 0; i < dataArr.length; i++) {
      const entity = dataArr[i].entity;
      if (Math.random() <= this.chanceToChangeDirection) {
        entity.heading += Math.random() * this.maxHeadingChange * getSign();
      }

      entity.position.lat += Math.cos(entity.heading) * this.maxMovementDistance;
      entity.position.long += Math.sin(entity.heading) * this.maxMovementDistance;
      let altitudeChange = Math.random() * this.maxAltitudeChange * getSign();
      if (entity.position.altitude + altitudeChange < 0 || entity.position.altitude + altitudeChange > 20000) {
        altitudeChange *= -1;
      }
      entity.position.altitude += altitudeChange;
      entity.futurePosition = this.getFuturePosition(entity.position, entity.heading);
    }
    return dataArr;
  }

}
