import { Cartesian2, Cartesian3 } from 'cesium';
import { HtmlCollection } from '../collections';
export declare class HtmlPrimitive {
    private _scene;
    private _show;
    private _position;
    private _lastPosition;
    private _pixelOffset;
    private _element;
    private _collection;
    private _mapContainer;
    constructor(options: any, collection?: HtmlCollection);
    set scene(scene: any);
    set show(show: boolean);
    get show(): boolean;
    set position(position: Cartesian3);
    get position(): Cartesian3;
    set pixelOffset(pixelOffset: Cartesian2);
    get pixelOffset(): Cartesian2;
    set element(element: HTMLElement);
    get element(): HTMLElement;
    set collection(collection: HtmlCollection);
    get collection(): HtmlCollection;
    update(): void;
    remove(): void;
}
