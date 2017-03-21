declare let Cesium;

if (!Cesium || typeof Cesium !== 'object') {
    throw new Error(`Cesium Extender ERROR: Cesium is required`);
}

export {Cesium};