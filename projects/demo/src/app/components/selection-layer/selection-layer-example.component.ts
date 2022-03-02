import { from as observableFrom, Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cartesian3 } from 'cesium';
import {
  AcEntity,
  AcLayerComponent,
  AcNotification,
  ActionType,
  CesiumEvent,
  CesiumEventModifier,
  SelectionManagerService
} from 'angular-cesium';
import { MatSnackBar } from '@angular/material/snack-bar';

class MyEntity extends AcEntity {
  selected = false;
  image = 'assets/fighter-jet.png';

  constructor(public position: Cartesian3,
              public id: string) {
    super();
  }
}

@Component({
  selector: 'selection-layer-example',
  templateUrl: 'selection-layer-example.component.html',
  styleUrls: [],
  providers: [SelectionManagerService]
})
export class SelectionLayerExampleComponent implements OnInit {

  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  selectionImage = '/assets/selected.png';
  entities$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;

  constructor(private selectionManager: SelectionManagerService, private snakBar: MatSnackBar) {
    const entities = [
      new MyEntity(Cartesian3.fromDegrees(10.0, 30.0), '1'),
      new MyEntity(Cartesian3.fromDegrees(33.0, 33.0), '2')
    ];
    const entitiesNotifications = entities.map((entity, index) => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity
    }));
    this.entities$ = observableFrom(entitiesNotifications);
  }

  ngOnInit() {
    this.selectionManager.initSelection({
      event: CesiumEvent.LEFT_CLICK,
      modifier: CesiumEventModifier.ALT
    });

    this.selectionManager.selectedEntity$().subscribe(selectedEntity => {
      const myEntity = selectedEntity as MyEntity;
      this.layer.update(myEntity, myEntity.id);

      console.log('all selected entities:', this.selectionManager.selectedEntities());
    });
    this.snakBar.open('Click + ALT to selected the plane', 'ok');
  }

  setShow($event: boolean) {
    this.show = $event;
  }

}
