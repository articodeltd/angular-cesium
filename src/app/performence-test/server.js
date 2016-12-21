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


let numOfEntities = 500;
let interval = 2;
let sendOption = 'oneByOne';
var intervalID;

io.on('connection', function (connectionSocket) {
    intervalID = sendOneByOne();
    console.log(intervalID);
});

app.post('/change', function (req, res, next) {
    console.log(`change to: ${JSON.stringify(req.body)}`);

    numOfEntities = req.body.numOfEntities;
    interval = req.body.interval;
    sendOption = req.body.sendOption;

    console.log(intervalID);
    clearInterval(intervalID);
     console.log(intervalID);
    switch (sendOption) {
        case 'oneByOne':
            console.log('oneByOne')
            intervalID = sendOneByOne();
            break;
        case 'chunk':
            dataChunck = createChunck(numOfEntities);
            intervalId = setInterval(() => {
                console.log('emit chunk');
                io.emit('birds', dataChunck);
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
        console.log('oneByOne');
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