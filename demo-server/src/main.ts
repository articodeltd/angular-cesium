require('newrelic');
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import * as cors from 'cors';
import * as socketIo from 'socket.io';
import scheme from './schema/schema';
import { resolverMap, trackResolver } from './resolvers/resolvers';
import { Simulative } from './simulative/simulative';

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

app.use(cors());
app.use(bodyParser.json());

// Serve client
app.use(express.static(path.resolve(__dirname + '/../../dist/angular-cesium-demo')));
app.use(express.static(__dirname + '/../../'));
app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../../dist/angular-cesium-demo/index.html'));
});

app.use(bodyParser.urlencoded({
  extended : true
}));


const myGraphQLSchema = makeExecutableSchema({typeDefs : scheme,
  resolvers : Object.assign(resolverMap, trackResolver)});
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema : myGraphQLSchema,
  debug : true
} as any));
app.use('/graphiql', graphiqlExpress({
  endpointURL : '/graphql',
}));

httpServer.listen(PORT, () => {

  const simulative = new Simulative(io);
  simulative.startSendingSimulativeData();
  console.log('server started on: ' + PORT);
});
