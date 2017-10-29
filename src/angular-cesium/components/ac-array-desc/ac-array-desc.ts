import {
  AfterContentInit,
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
import { Subject } from 'rxjs/Subject';
import { IDescription } from '../../models/description';
import * as get from 'lodash.get';
import { AcLayerComponent } from '../ac-layer/ac-layer.component';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { Subscription } from 'rxjs/Subscription';

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
})
export class AcArrayDescComponent implements OnChanges, OnInit, AfterContentInit, OnDestroy, IDescription {
  @Input() acFor: string;

  @Input() idGetter: Function;
  @Input() show = true;
  @ViewChild('layer') private layer: AcLayerComponent;
  @ContentChildren(BasicDesc, { descendants: true }) private contentItems;
  private entitiesMap = new Map<string, string[]>();
  private layerServiceSubscription: Subscription;
  entityName: string;
  arrayPath: string;
  arrayObservable$ = new Subject<AcNotification>();

  constructor(public layerService: LayerService, private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['acFor'].firstChange) {
      const acForArr = changes['acFor'].currentValue.split(' ');
      this.arrayPath = acForArr[3];
      this.entityName = acForArr[1];
      const index = this.arrayPath.indexOf('.');
      if (index >= 0) {
        this.arrayPath = this.arrayPath.substr(index + 1);
      }
    }
  }

  ngOnInit(): void {
    this.layerService.registerDescription(this);
    this.layer.getLayerService().cache = false;
    this.layerServiceSubscription = this.layerService.layerUpdates().subscribe(() => {
      this.cd.detectChanges();
    })
  }

  ngAfterContentInit(): void {
    this.layerService.context['arrayObservable$'] = this.arrayObservable$;
    this.contentItems._results.forEach(component => {
      this.layerService.unregisterDescription(component);
      this.layer.getLayerService().registerDescription(component);
      component._layerService = this.layer.getLayerService();
    });
  }

  ngOnDestroy(): void {
    if (this.layerServiceSubscription) {
      this.layerServiceSubscription.unsubscribe();
    }
  }

  draw(context, id: string, contextEntity) {
    const entitiesArray: any[] = get(contextEntity, this.arrayPath);
    if (!entitiesArray) {
      return;
    }
    const previousEntitiesIdArray = this.entitiesMap.get(id);
    const entitiesIdArray = [];
    this.entitiesMap.set(id, entitiesIdArray);

    entitiesArray.forEach(item => {
      this.layerService.context[this.entityName] = item;
      const arrayItemId = this.generateCombinedId(id, this.idGetter(item));
      entitiesIdArray.push(arrayItemId);
      this.layer.update(contextEntity, arrayItemId);
    });

    if (previousEntitiesIdArray) {
      const entitiesToRemove = previousEntitiesIdArray.filter((entityId) => entitiesIdArray.indexOf(entityId) < 0);
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
  }

  removeAll() {
    this.layer.removeAll();
  }

  getAcForString() {
    return `let ${this.entityName + '___temp'} of arrayObservable$`;
  }


  private generateCombinedId(entityId: string, arrayItemId: string): string {
    return entityId + arrayItemId;
  }
}
