import {ScreenSpaceEventType } from 'cesium';
/**
 * Event options for registration on map-event-manager.
 */
export enum CesiumEvent {
  MOUSE_MOVE = ScreenSpaceEventType.MOUSE_MOVE,
  LEFT_CLICK = ScreenSpaceEventType.LEFT_CLICK,
  LEFT_DOUBLE_CLICK = ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  LEFT_DOWN = ScreenSpaceEventType.LEFT_DOWN,
  LEFT_UP = ScreenSpaceEventType.LEFT_UP,
  MIDDLE_CLICK = ScreenSpaceEventType.MIDDLE_CLICK,
  // MIDDLE_DOUBLE_CLICK = ScreenSpaceEventType.MIDDLE_DOUBLE_CLICK,
  MIDDLE_DOWN = ScreenSpaceEventType.MIDDLE_DOWN,
  MIDDLE_UP = ScreenSpaceEventType.MIDDLE_UP,
  PINCH_START = ScreenSpaceEventType.PINCH_START,
  PINCH_END = ScreenSpaceEventType.PINCH_END,
  PINCH_MOVE = ScreenSpaceEventType.PINCH_MOVE,
  RIGHT_CLICK = ScreenSpaceEventType.RIGHT_CLICK,
  // RIGHT_DOUBLE_CLICK = ScreenSpaceEventType.RIGHT_DOUBLE_CLICK,
  RIGHT_DOWN = ScreenSpaceEventType.RIGHT_DOWN,
  RIGHT_UP = ScreenSpaceEventType.RIGHT_UP,
  WHEEL = ScreenSpaceEventType.WHEEL,
  LONG_LEFT_PRESS = 110,
  LONG_RIGHT_PRESS,
  LONG_MIDDLE_PRESS,
  LEFT_CLICK_DRAG,
  RIGHT_CLICK_DRAG,
  MIDDLE_CLICK_DRAG,
}
