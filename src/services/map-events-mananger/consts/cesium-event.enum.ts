;

/**
 * Event options for registration on map-event-manager.
 */
export enum CesiumEvent {
	MOUSE_MOVE = Cesium.ScreenSpaceEventType.MOUSE_MOVE,
	LEFT_CLICK = Cesium.ScreenSpaceEventType.LEFT_CLICK,
	LEFT_DOUBLE_CLICK = Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
	LEFT_DOWN = Cesium.ScreenSpaceEventType.LEFT_DOWN,
	LEFT_UP = Cesium.ScreenSpaceEventType.LEFT_UP,
	MIDDLE_CLICK = Cesium.ScreenSpaceEventType.MIDDLE_CLICK,
	MIDDLE_DOUBLE_CLICK = Cesium.ScreenSpaceEventType.MIDDLE_DOUBLE_CLICK,
	MIDDLE_DOWN = Cesium.ScreenSpaceEventType.MIDDLE_DOWN,
	MIDDLE_UP = Cesium.ScreenSpaceEventType.MIDDLE_UP,
	PINCH_START = Cesium.ScreenSpaceEventType.PINCH_START,
	PINCH_END = Cesium.ScreenSpaceEventType.PINCH_END,
	PINCH_MOVE = Cesium.ScreenSpaceEventType.PINCH_MOVE,
	RIGHT_CLICK = Cesium.ScreenSpaceEventType.RIGHT_CLICK,
	RIGHT_DOUBLE_CLICK = Cesium.ScreenSpaceEventType.RIGHT_DOUBLE_CLICK,
	RIGHT_DOWN = Cesium.ScreenSpaceEventType.RIGHT_DOWN,
	RIGHT_UP = Cesium.ScreenSpaceEventType.RIGHT_UP,
	WHEEL = Cesium.ScreenSpaceEventType.WHEEL,
	LONG_LEFT_PRESS = 110,
	LONG_RIGHT_PRESS,
	LONG_MIDDLE_PRESS
}
