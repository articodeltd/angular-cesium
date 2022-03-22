import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AcNotification } from '../../models/ac-notification';
import { Subject, Subscription } from 'rxjs';
import { IDescription } from '../../models/description';
import { get } from 'lodash';
import { AcLayerComponent } from '../ac-layer/ac-layer.component';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';

/**
 *  This is component represents an array under `ac-layer`.
 *  The element must be a child of ac-layer element.
 *  + acFor `{string}` - get the tracked array and entityName (see the example).
 *  + idGetter `{Function}` - a function that gets the id for a given element in the array -should be defined for maximum performance.
 *  + show `{boolean}` - show/hide array's entities.
 *
 *  __Usage :__
 *  ```
 *<ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
 *  <ac-array-desc acFor="let arrayItem of track.array" [idGetter]="trackArrayIdGetter">
 *    <ac-array-desc acFor="let innerArrayItem of arrayItem.innerArray" [idGetter]="trackArrayIdGetter">
 *      <ac-point-desc props="{
 *        position: innerArrayItem.pos,
 *        pixelSize: 10,
 *        color: getTrackColor(track),
 *        outlineColor: Color.BLUE,
 *        outlineWidth: 1
 *      }">
 *      </ac-point-desc>
 *    </ac-array-desc>
 *  </ac-array-desc>
 *</ac-layer>
 *  ```
 */

@Component({
  selector: 'ac-array-desc',
  template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcArrayDescComponent implements OnChanges, OnInit, AfterContentInit, OnDestroy, IDescription {

  @Input() acFor: string;

  @Input() idGetter: (item: any, index: number) => string;

  @Input() show = true;
  @ViewChild('layer', {static: true}) private layer: AcLayerComponent;
  @ContentChildren(BasicDesc, {descendants: false}) private basicDescs: any;
  @ContentChildren(AcArrayDescComponent, {descendants: false}) private arrayDescs: any;
  private entitiesMap = new Map<string, string[]>();
  private layerServiceSubscription: Subscription;
  private id = 0;
  private readonly acForRgx = /^let\s+.+\s+of\s+.+$/;
  entityName: string;
  arrayPath: string;
  arrayObservable$ = new Subject<AcNotification>();

  constructor(public layerService: LayerService, private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['acFor'].firstChange) {
      const acForString = changes['acFor'].currentValue;
      if (!this.acForRgx.test(acForString)) {
        throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${acForString}`);
      }
      const acForArr = changes['acFor'].currentValue.split(' ');
      this.arrayPath = acForArr[3];
      this.entityName = acForArr[1];
    }
  }

  ngOnInit(): void {
    if (this.layer) {
      this.layer.getLayerService().cache = false;
    }

    this.layerServiceSubscription = this.layerService.layerUpdates().subscribe(() => {
      this.cd.detectChanges();
    });
  }

  ngAfterContentInit(): void {
    this.layerService.context['arrayObservable$'] = this.arrayObservable$;
    this.layerService.registerDescription(this);
    this.basicDescs._results.forEach((component: BasicDesc) => {
      component.setLayerService(this.layer.getLayerService());
    });
    this.arrayDescs._results.splice(0, 1);
    this.arrayDescs._results.forEach((component: AcArrayDescComponent) => {
      this.layerService.unregisterDescription(component);
      this.layer.getLayerService().registerDescription(component);
      component.layerService = this.layer.getLayerService();
      component.setLayerService(this.layer.getLayerService());
    });
  }

  ngOnDestroy(): void {
    if (this.layerServiceSubscription) {
      this.layerServiceSubscription.unsubscribe();
    }
  }

  setLayerService(layerService: LayerService) {
    this.layerService = layerService;
  }

  draw(context: any, id: string, contextEntity: any) {
    const entitiesArray: any[] = get(context, this.arrayPath);
    if (!entitiesArray) {
      return;
    }
    const previousEntitiesIdArray = this.entitiesMap.get(id);
    const entitiesIdArray: any[] = [];
    this.entitiesMap.set(id, entitiesIdArray);

    entitiesArray.forEach((item, index) => {
      this.layerService.context[this.entityName] = item;
      const arrayItemId = this.generateCombinedId(id, item, index);
      entitiesIdArray.push(arrayItemId);
      this.layer.update(contextEntity, arrayItemId);
    });

    if (previousEntitiesIdArray) {
      const entitiesToRemove = this.idGetter ?
        previousEntitiesIdArray.filter((entityId) => entitiesIdArray.indexOf(entityId) < 0) :
        previousEntitiesIdArray;
      if (entitiesToRemove) {
        entitiesToRemove.forEach((entityId) => this.layer.remove(entityId));
      }
    }
  }

  remove(id: string) {
    const entitiesIdArray = this.entitiesMap.get(id);
    if (entitiesIdArray) {
      entitiesIdArray.forEach((entityId) => this.layer.remove(entityId));
    }
    this.entitiesMap.delete(id);
  }

  removeAll() {
    this.layer.removeAll();
    this.entitiesMap.clear();
  }

  getAcForString() {
    return `let ${this.entityName + '___temp'} of arrayObservable$`;
  }

  private generateCombinedId(entityId: string, arrayItem: any, index: number): string {
    let arrayItemId;
    if (this.idGetter) {
      arrayItemId = this.idGetter(arrayItem, index);
    } else {
      arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
    }
    return entityId + arrayItemId;
  }
}
