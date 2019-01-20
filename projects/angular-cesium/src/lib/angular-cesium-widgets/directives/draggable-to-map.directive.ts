import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { DraggableToMapService } from '../services/draggable-to-map.service';

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

@Directive({selector: '[draggableToMap]'})
export class DraggableToMapDirective implements OnInit {
  @Input() draggableToMap: { src: string, style?: any } | string;
  private src: string;
  private style: any;

  constructor(el: ElementRef, private iconDragService: DraggableToMapService) {
    el.nativeElement.style['user-drag'] = 'none';
    el.nativeElement.style['user-select'] = 'none';
    el.nativeElement.style['-moz-user-select'] = 'none';
    el.nativeElement.style['-webkit-user-drag'] = 'none';
    el.nativeElement.style['-webkit-user-select'] = 'none';
    el.nativeElement.style['-ms-user-select'] = 'none';
  }

  ngOnInit(): void {
    if (typeof this.draggableToMap === 'string') {
      this.src = this.draggableToMap;
    } else {
      this.src = this.draggableToMap.src;
      this.style = this.draggableToMap.style;
    }
  }

  @HostListener('mousedown')
  onMouseDown() {
    this.iconDragService.drag(this.src, this.style);
  }
}
