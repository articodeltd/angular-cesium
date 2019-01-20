import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlonterService } from '../../services/plonter/plonter.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';

@Component(
  {
    selector: 'ac-default-plonter',
    template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `,
    styles: [`
        .plonter-context-menu {
            background-color: rgba(250, 250, 250, 0.8);
            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);
        }

        .plonter-item {
            cursor: pointer;
            padding: 2px 15px;
            text-align: start;
        }

        .plonter-item:hover {
            background-color: rgba(0, 0, 0, 0.15);
        }

    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CoordinateConverter],
  }
)
export class AcDefaultPlonterComponent implements OnInit {

  constructor(public plonterService: PlonterService,
              private cd: ChangeDetectorRef,
              private geoConverter: CoordinateConverter) {
  }

  ngOnInit() {
    this.plonterService.plonterChangeNotifier.subscribe(() => this.cd.detectChanges());
  }

  get plonterPosition() {
    if (this.plonterService.plonterShown) {
      const screenPos = this.plonterService.plonterClickPosition.endPosition;
      return this.geoConverter.screenToCartesian3(screenPos);
    }
  }

  chooseEntity(entity: any) {
    this.plonterService.resolvePlonter(entity);
  }
}
