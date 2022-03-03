import { fromEvent as observableFromEvent, Observable, Subject } from 'rxjs';

import { map, merge, takeUntil, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Cartesian3 } from 'cesium';
import { Vec2 } from '../../angular-cesium/models/vec2';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapsManagerService } from '../../angular-cesium/services/maps-manager/maps-manager.service';

export interface IconDragEvent {
  initialScreenPosition: Vec2;
  screenPosition: Vec2;
  mapPosition: Cartesian3;
  drop: boolean;
}

/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */

@Injectable()
export class DraggableToMapService {

  private coordinateConverter: CoordinateConverter;
  private dragObservable: Observable<IconDragEvent>;
  private stopper: Subject<any>;
  private mainSubject = new Subject<IconDragEvent>();

  constructor(@Inject(DOCUMENT) private document: any, private mapsManager: MapsManagerService) {
  }

  setCoordinateConverter(coordinateConverter: CoordinateConverter) {
    this.coordinateConverter = coordinateConverter;
  }

  drag(imageSrc: string, style?: any) {
    if (!this.coordinateConverter) {
      const mapComponent = this.mapsManager.getMap();
      if (mapComponent) {
        this.coordinateConverter = mapComponent.getCoordinateConverter();
      }
    }
    this.cancel();
    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    imgElement.style.position = 'fixed';
    imgElement.style.visibility = 'hidden';
    imgElement.style.width = '30px';
    imgElement.style.height = '30px';
    imgElement.style['user-drag'] = 'none';
    imgElement.style['user-select'] = 'none';
    imgElement.style['-moz-user-select'] = 'none';
    imgElement.style['-webkit-user-drag'] = 'none';
    imgElement.style['-webkit-user-select'] = 'none';
    imgElement.style['-ms-user-select'] = 'none';
    Object.assign(imgElement.style, style);
    document.body.appendChild(imgElement);

    this.createDragObservable();
    this.dragObservable.subscribe(
      (e) => {
        imgElement.style.visibility = 'visible';
        imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
        imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
        this.mainSubject.next(e);
        if (e.drop) {
          imgElement.remove();
        }
      },
      (e: any) => {
        imgElement.remove();
      },
      () => {
        imgElement.remove();
      }
    );
  }

  dragUpdates(): Observable<IconDragEvent> {
    return this.mainSubject;
  }

  cancel() {
    if (this.stopper) {
      this.stopper.next(true);
      this.stopper = undefined;
      this.dragObservable = undefined;
    }
  }

  private createDragObservable() {
    const stopper = new Subject();
    const dropSubject = new Subject<any>();
    const pointerUp = observableFromEvent(document, 'pointerup');
    const pointerMove = observableFromEvent(document, 'pointermove');

    let dragStartPositionX: number;
    let dragStartPositionY: number;
    let lastMove: any;
    const moveObservable = pointerMove.pipe(map((e: any) => {
        dragStartPositionX = dragStartPositionX ? dragStartPositionX : e.x;
        dragStartPositionY = dragStartPositionY ? dragStartPositionY : e.y;
        lastMove = {
          drop: false,
          initialScreenPosition: {
            x: dragStartPositionX,
            y: dragStartPositionY,
          },
          screenPosition: {
            x: e.x,
            y: e.y,
          },
          mapPosition: this.coordinateConverter ?
            this.coordinateConverter.screenToCartesian3({x: e.x, y: e.y}) : undefined,
        };
        return lastMove;
      }),
      takeUntil(pointerUp),
      tap(undefined, undefined, () => {
        if (lastMove) {
          const dropEvent = Object.assign({}, lastMove);
          dropEvent.drop = true;
          dropSubject.next(dropEvent);
        }
      }), );

    this.dragObservable = moveObservable.pipe(merge(dropSubject), takeUntil(stopper), );
    this.stopper = stopper;
  }
}
