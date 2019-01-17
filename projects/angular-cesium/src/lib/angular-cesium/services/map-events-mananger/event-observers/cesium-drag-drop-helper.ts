import { CesiumEvent } from '../consts/cesium-event.enum';

export class CesiumDragDropHelper {

  public static dragEvents: Set<CesiumEvent> = new Set([
    CesiumEvent.LEFT_CLICK_DRAG,
    CesiumEvent.RIGHT_CLICK_DRAG,
    CesiumEvent.MIDDLE_CLICK_DRAG
  ]);


  public static getDragEventTypes(dragEvent: CesiumEvent) {
    let mouseDownEvent;
    let mouseUpEvent;
    if (dragEvent === CesiumEvent.LEFT_CLICK_DRAG) {
      mouseDownEvent = CesiumEvent.LEFT_DOWN;
      mouseUpEvent = CesiumEvent.LEFT_UP;
    } else if (dragEvent === CesiumEvent.RIGHT_CLICK_DRAG) {
      mouseDownEvent = CesiumEvent.RIGHT_DOWN;
      mouseUpEvent = CesiumEvent.RIGHT_UP;
    } else if (dragEvent === CesiumEvent.MIDDLE_CLICK_DRAG) {
      mouseDownEvent = CesiumEvent.MIDDLE_DOWN;
      mouseUpEvent = CesiumEvent.MIDDLE_UP;
    }

    return {mouseDownEvent, mouseUpEvent};
  }
}
