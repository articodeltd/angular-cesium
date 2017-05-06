import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import * as cors from 'cors';
import * as socketIo from 'socket.io';
import scheme from './schema/schema';
import { resolverMap } from './resolvers/resolvers';
import { GraphQLSchema } from 'graphql';
import {
  changeSimSendingParams, getSimSendingParams,
  startSendingSimulativeData
} from './simulative/simulative';

const PORT = 3000;
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

console.log(__dirname);
app.get('/', function (req, res) {
  // TODO demo client
  res.sendFile(__dirname + '/app/index.html');
});
app.use(bodyParser.urlencoded({
  extended : true
}));


const myGraphQLSchema = makeExecutableSchema({typeDefs : scheme, resolvers : resolverMap});
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema : myGraphQLSchema as GraphQLSchema,
  debug : true
}));
app.use('/graphiql', graphiqlExpress({
  endpointURL : '/graphql',
}));

app.post('/change', (req, res, next) => {
  changeSimSendingParams(req.body);
  res.send('changed successfully');
});

app.get('/data', (req, res) => {
  res.send(getSimSendingParams());
});

httpServer.listen(PORT, () => {
  startSendingSimulativeData(io);
  console.log('server started on: ' + PORT)
});