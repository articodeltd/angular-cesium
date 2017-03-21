import {Cesium} from "../cesium-ref/cesium-ref";
import {HtmlPrimitive} from "../primitives";
import {HtmlCollection} from "../collections";

export class CesiumExtender {
    static extend() {
        Cesium.HtmlPrimitive = HtmlPrimitive;
        Cesium.HtmlCollection = HtmlCollection;
    }
}