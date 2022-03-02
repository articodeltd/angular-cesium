declare var Cesium: any;
import { HtmlPrimitive } from './primitives';
import { HtmlCollection } from './collections';

export class CesiumExtender {
  static extend() {
    Cesium.HtmlPrimitive = HtmlPrimitive;
    Cesium.HtmlCollection = HtmlCollection;
  }
}
