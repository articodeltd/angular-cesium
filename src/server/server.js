let express = require('express');
let app = express();
let http = require('http');
let httpServer = http.createServer(app);
let io = require('socket.io')(httpServer);
let bodyParser = require('body-parser');
let cors = require('cors');

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


let numOfEntities = 30;
let interval = 500;
let sendOption = 'all';
let intervalId;
let numOfObjectsInPart = 20;
let socket;

io.on('connection', function (connectionSocket) {
    socket = connectionSocket;
    switch (sendOption) {
        case 'oneByOne':
            intervalId = sendOneByOne();
            break;
        case 'all':
            intervalId = sendAll(createData(numOfEntities));
            break;
        case 'partsByParts':
            intervalId = sendPartsByParts(numOfObjectsInPart);
            break;
        default:
            console.log('WTF wrong sendOption');
    }
});

app.get('/data', function (req, res) {
    res.send({
        numOfEntities: numOfEntities,
        sendOption: sendOption,
        interval: interval,
        numOfObjectsInPart: numOfObjectsInPart
    });
});

app.post('/change', function (req, res, next) {
    console.log(`change to: ${JSON.stringify(req.body)}`);

    numOfEntities = req.body.numOfEntities;
    interval = req.body.interval;
    sendOption = req.body.sendOption;
    numOfObjectsInPart = req.body.numOfObjectsInPart;

    switch (sendOption) {
        case 'oneByOne':
            intervalId = sendOneByOne();
            break;
        case 'all':
            intervalId = sendAll(createData(numOfEntities));
            break;
        case 'partsByParts':
            intervalId = sendPartsByParts(numOfObjectsInPart);
            break;
        default:
            console.log('WTF wrong sendOption');
    }

    res.send('changed successfully');
});

function sendAll(data) {
    clearInterval(intervalId);
    return setInterval(() => {
        io.emit('birds', data);
    }, interval);
}

function sendOneByOne() {
    let counter = 0;
    clearInterval(intervalId);
    const id = setInterval(() => {
        let entityId = counter % numOfEntities;
        let getSign = Math.random() > 0.5 ? 1 : -1;
        io.emit('birds', [{
            id: entityId,
            action: 'ADD_OR_UPDATE',
            entity: {
                id: entityId,
                name: 'bird' + counter % numOfEntities,
                image: "/assets/angry-bird-blue-icon.png",
                position: {
                    lat: 60 * Math.random() * getSign,
                    long: 100 * Math.random() * getSign
                }
            }
        }]);
        counter++;
    }, interval);

    return id;
}

function createData(numOfEntities) {
    const data = [];
    for (let i = 0; i < numOfEntities; i++) {
        let getSign = Math.random() > 0.5 ? 1 : -1;
        data.push({
            id: i,
            action: 'ADD_OR_UPDATE',
            entity: {
                id: i,
                name: 'bird' + i,
                image: "/assets/angry-bird-blue-icon.png",
                position: {
                    lat: 60 * Math.random() * getSign,
                    long: 100 * Math.random() * getSign
                }
            }
        });
    }
    return data;
}

function sendPartsByParts(numberOfObjects) {
    let counter = 0;
    clearInterval(intervalId);
    const id = setInterval(() => {
        let entityId = counter % numOfEntities;
        counter += numberOfObjects;
        let data = createCollection(entityId, numberOfObjects);
        io.emit('birds', data);
    }, interval);

    return id;
}

function createCollection(startId, numberOfObjects) {
    let data = [];
    for (let i = startId; i < numOfEntities && i < startId + numberOfObjects; i++) {
        let getSign = Math.random() > 0.5 ? 1 : -1;
        data.push({
            id: i,
            action: 'ADD_OR_UPDATE',
            entity: {
                id: i,
                name: 'bird' + i,
                image: "/assets/angry-bird-blue-icon.png",
                position: {
                    lat: 60 * Math.random() * getSign,
                    long: 100 * Math.random() * getSign
                }
            }
        });
    }
    return data;
}
