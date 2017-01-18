generateChunck = function (numOfEntities, width) {
    const data = [];
    for (let i = 0; i < numOfEntities; i++) {
        data.push({
            id: i,
            action: 'ADD_OR_UPDATE',
            entity: {
                width: width
            }
        });
    }
    return data;
};
sendOneByOne = function (io, interval, numOfEntities, width) {
    let counter = 0;
    console.log(interval);
    const id = setInterval(() => {
        io.emit('dynamic-polyline', [{
            id: counter++ % numOfEntities,
            action: 'ADD_OR_UPDATE',
            entity: {
                width: width
            }
        }]);
    }, interval);
    return id;
};

module.exports = {
    generateChunck: generateChunck,
    sendOneByOne: sendOneByOne
};