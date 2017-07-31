import Timer = NodeJS.Timer;

export class SimClient {
  public intervalId: Timer;
  public simData: any;
  
  
  constructor(public numOfEntities: number,
              public intervalMs: number,
              public socket: SocketIO.Socket,
             ) {
  }

  getSimSendingParams() {
    return {numOfEntities : this.numOfEntities, interval : this.intervalMs};
  }
}
