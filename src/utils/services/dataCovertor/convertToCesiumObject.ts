export function convertToCesiumObj(entity): any {
    entity.scale = entity.id === 1 ? 0.3 : 0.15;
    entity.color = entity.id === 1 ? Cesium.Color.RED : undefined;
    entity.position = Cesium.Cartesian3.fromDegrees(entity.position.long, entity.position.lat);
    return entity;
}