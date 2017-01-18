let express = require('express');
let app = express();
let http = require('http');
let httpServer = http.createServer(app);
let io = require('socket.io')(httpServer);
let bodyParser = require('body-parser');
let cors = require('cors');
let dynamicPolylineGenerator = require('./dynamic-polyline/dynamic-polyline-generator');

app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/index.html');
});
httpServer.listen(3000, function () {
    console.log('listening on *:3000');
});


let numOfEntities = 2;
let interval = 5000;
let width = 3;
let sendOption = 'chunk';
let intervalId;
let dataChunk;
let socket;

io.on('connection', function (connectionSocket) {
    socket = connectionSocket;
    /*let dataChunk = createChunck(numOfEntities);
    intervalId = setInterval(() => {
        io.emit('birds', dataChunk);
    }, interval);*/
    let dataChunk = dynamicPolylineGenerator.generateChunck(numOfEntities,width)
    intervalId = setInterval(() => {
        io.emit('dynamic-polyline', dataChunk);
    }, interval);
});

app.post('/change', function (req, res, next) {
    console.log(`change to: ${JSON.stringify(req.body)}`);

    numOfEntities = req.body.numOfEntities;
    interval = req.body.interval;
    sendOption = req.body.sendOption;

    clearInterval(intervalId);
    switch (sendOption) {
        case 'oneByOne':
            console.log('oneByOne')
            intervalId = sendOneByOne();
            break;
        case 'chunk':
            dataChunk = createChunck(numOfEntities);
            intervalId = setInterval(() => {
                io.emit('birds', dataChunk);
            }, interval);

            break;
        default:
            console.log('WTF wrong sendOption');
    }

    res.send('changed successfully');
});

function sendOneByOne() {
    let counter = 0;
    console.log(interval);
    const id = setInterval(() => {
        io.emit('birds', [{
            id: counter++ % numOfEntities,
            action: 'ADD_OR_UPDATE',
            entity: {
                name: 'bird',
                image: "/assets/angry-bird-blue-icon.png"
            }
        }]);
    }, interval);

    return id;
}

function createChunck(numOfEntities) {
    const data = [];
    for (let i =0; i < numOfEntities; i++) {
        data.push({
            id: i,
            action: 'ADD_OR_UPDATE',
            entity: {
                name: 'bird',
                image: "/assets/angry-bird-blue-icon.png"
            }
        });
    }
    return data;
}
