import { map } from 'rxjs/operators';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcLayerComponent, AcNotification, ActionType, CesiumEvent, MapEventsManagerService, PickOptions } from 'angular-cesium';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';

@Component({
  selector: 'entities-with-arrays-example',
  template: `
      <ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
          <ac-point-desc props="{
                    position: track.position,
                    pixelSize: 20,
                    color: track.color,
                    outlineColor: Color.RED,
                }">
          </ac-point-desc>

          <ac-array-desc acFor="let arrayItem of track.array" [idGetter]="trackArrayIdGetter">
              <ac-point-desc props="{
                    position: arrayItem.pos,
                    pixelSize: 10,
                    color: track.color,
                    outlineColor: Color.RED,
                    outlineWidth: 2
                }">
              </ac-point-desc>
              <ac-array-desc acFor="let innerArrayItem of arrayItem.innerArray" [idGetter]="trackArrayIdGetter">
                  <ac-point-desc props="{
                      position: innerArrayItem.pos,
                      pixelSize: 10,
                      color: track.color,
                      outlineColor: Color.BLUE,
                      outlineWidth: 2
                  }">
                  </ac-point-desc>
              </ac-array-desc>
          </ac-array-desc>
      </ac-layer>

  `,
})
export class EntitiesWithArraysExampleComponent implements OnInit, OnChanges {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  @Input()
  show: boolean;

  private tracks$: Observable<AcNotification>;
  private Cesium = Cesium;
  private lastPickTrack: any;

  constructor(private mapEventsManager: MapEventsManagerService,
              private dataProvider: MockDataProviderService) {
  }

  ngOnInit() {
    this.tracks$ = this.dataProvider.getDataSteam$().pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));

    const mouseOverObservable = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.PICK_FIRST,
      priority: 2,
    });

    // Change color on hover
    mouseOverObservable.subscribe((event) => {
      const track = event.entities !== null ? event.entities[0] : null;
      if (this.lastPickTrack && (!track || track.id !== this.lastPickTrack.id)) {
        this.lastPickTrack.picked = false;
        this.layer.update(this.lastPickTrack, this.lastPickTrack.id);
      }
      if (track && (!this.lastPickTrack || track.id !== this.lastPickTrack.id)) {
        track.picked = true;
        this.layer.update(track, track.id);
      }
      this.lastPickTrack = track;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      this.show = changes['show'].currentValue;

    }
  }

  trackArrayIdGetter(entity: any): string {
    return entity.id;
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event: boolean) {
    this.show = $event;
  }
}

