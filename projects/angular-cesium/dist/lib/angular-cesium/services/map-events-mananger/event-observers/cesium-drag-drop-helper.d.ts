import { CesiumEvent } from '../consts/cesium-event.enum';
export declare class CesiumDragDropHelper {
    static dragEvents: Set<CesiumEvent>;
    static getDragEventTypes(dragEvent: CesiumEvent): {
        mouseDownEvent: any;
        mouseUpEvent: any;
    };
}
