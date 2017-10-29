import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnChanges,
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

@Component({
  selector: 'ac-array-desc',
  template: `
      <ac-layer #layer [acFor]="getAcForString()" [context]="context">
          <ng-content #content></ng-content>
      </ac-layer>
  `,
})
export class AcArrayDescComponent implements OnChanges, OnInit, AfterContentInit, IDescription {
  @Input() context;

  @Input() acFor: string;
  @Input() idGetter: Function;
  @ViewChild('layer') private layer: AcLayerComponent;
  @ContentChildren(BasicDesc, { descendants: true }) private contentItems;
  private entitiesMap = new Map<string, string[]>();

  entityName: string;
  arrayPath: string;
  arrayObservable$ = new Subject<AcNotification>();

  constructor(private layerService: LayerService, private elt: ElementRef) {
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
    if (changes['context'].firstChange) {
      changes['context'].currentValue['arrayObservable$'] = this.arrayObservable$;
    }
  }

  ngOnInit(): void {
    this.layerService.registerDescription(this);
  }

  ngAfterContentInit(): void {
    this.contentItems._results.forEach(component => {
      component._layerService.unregisterDescription(component);
      component._layerService = this.layer['layerService'];
      this.layer['layerService'].registerDescription(component);
    });
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
      this.context[this.entityName] = item;
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
