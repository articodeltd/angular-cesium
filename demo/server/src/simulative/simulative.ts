import { SimClient } from './sim-client';
import { SimGenerator } from './sim-generator';

const DEFAULT_NUM_OF_ENTITIES = 500;
const DEFAULT_INTERVAL = 1000;
const MAX_NUM_OF_ENTITIES = 5000;
const MIN_INTERVAL = 100;

interface SendingParams {
  rate: number;
  numOfEntities: number;
}
export class Simulative {
  constructor(private io: SocketIO.Server){}

  startSendingSimulativeData() {
    // start listening for connections
    this.io.on('connection', (socket: SocketIO.Socket) => {
      // for every user start sending data
      console.log('a user connected', socket.id);
      const client = new SimClient(DEFAULT_NUM_OF_ENTITIES, DEFAULT_INTERVAL, socket);
      const simSender = new SimGenerator(client);
      simSender.createSimData();
      simSender.startSendingSimData();

      // on disconnects stop sending data
      socket.on('disconnect', (r: any) => this.removeClient(client, r));
      socket.on('error', (r: any) => this.removeClient(client, r));

      // change sending
      socket.on('change_sending',
        (params: SendingParams, ackFn: any) => this.changeSendingParams(params, client, simSender, ackFn));

      socket.on('get_sending_params',
        (params: SendingParams, acknowledgement: any) => acknowledgement(client.getSimSendingParams()));
    });
  }

  removeClient(client: SimClient, reason: string) {
    console.log('disconnected', reason, 'id', client.socket.id);
    clearInterval(client.intervalId);
  }

  changeSendingParams(newParams: SendingParams, client: SimClient, simSender: SimGenerator, ackFn: Function) {
    console.log(`change to: ${JSON.stringify(newParams)}`);

    if (newParams.numOfEntities <= MAX_NUM_OF_ENTITIES && newParams.rate >= MIN_INTERVAL){
      client.numOfEntities = newParams.numOfEntities;
      client.intervalMs = newParams.rate;

      simSender.restart();
      ackFn('success');
    }else {
      ackFn('fail');
    }
  }
}
