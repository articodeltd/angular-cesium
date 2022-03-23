import { ElementRef, OnInit } from '@angular/core';
import { DraggableToMapService } from '../services/draggable-to-map.service';
import * as i0 from "@angular/core";
/**
 * This directive is used to allow dragging of icons from outside the map over the map
 * while being notified of the dragging position and drop position with an observable exposed from `DraggableToMapService`.
 * @Input {src: string, style?: any} | string -
 * the [src: string | string] should be the image src of the dragged image.
 * The style is an optional style object for the image.
 *
 * example:
 * ```
 * <a href="..." class="..." [draggableToMap]="{src: '../assets/GitHub-Mark-Light.png', style: {width: '50px', height: '50px'}}">
 *     <img class="github" src="../assets/GitHub-Mark-Light.png">
 * </a>
 * ```
 *
 * In order the get notified of the dragging location  and drop state subscribe to `DraggableToMapService.dragUpdates()`
 * ```
 *  this.iconDragService.dragUpdates().subscribe(e => console.log(e));
 * ```
 *
 * In order the cancel dragging use `DraggableToMapService.cancel()`
 * ```
 *  this.iconDragService.cancel();
 * ```
 */
export declare class DraggableToMapDirective implements OnInit {
    private iconDragService;
    draggableToMap: {
        src: string;
        style?: any;
    } | string;
    private src;
    private style;
    constructor(el: ElementRef, iconDragService: DraggableToMapService);
    ngOnInit(): void;
    onMouseDown(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DraggableToMapDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DraggableToMapDirective, "[draggableToMap]", never, { "draggableToMap": "draggableToMap"; }, {}, never>;
}
