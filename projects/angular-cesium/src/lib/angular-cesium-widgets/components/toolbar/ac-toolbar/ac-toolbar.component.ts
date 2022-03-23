import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { fromEvent as observableFromEvent, Subscription, Observable } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { CesiumService } from '../../../../angular-cesium/services/cesium/cesium.service';


/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true" (onDrag)="handleDrag($event)">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
@Component(
  {
    selector: 'ac-toolbar',
    template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        :host {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 20px;
            height: 20px;
            z-index: 999;
            -webkit-user-drag: none;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
  }
)
export class AcToolbarComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  toolbarClass: string;
  @Input()
  allowDrag = true;
  @Output()
  onDrag = new EventEmitter<MouseEvent>();

  dragStyle = {
    'height.px': 20,
    'width.px': 20,
  };

  private mouseDown$: Observable<MouseEvent>;
  private mouseMove$: Observable<MouseEvent>;
  private mouseUp$: Observable<MouseEvent>;
  private drag$: Observable<MouseEvent>;
  private dragSubscription: Subscription;

  constructor(private element: ElementRef, private cesiumService: CesiumService) {}

  ngOnInit() {
    this.cesiumService.getMapContainer().appendChild(this.element.nativeElement);
    if (this.allowDrag) {
      this.listenForDragging();
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.allowDrag && changes.allowDrag.currentValue && !changes.allowDrag.previousValue) {
      this.listenForDragging();
    }

    if (changes.allowDrag && !changes.allowDrag.currentValue && changes.allowDrag.previousValue) {
      this.dragSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    if (this.dragSubscription) {
      this.dragSubscription.unsubscribe();
    }
  }

  private listenForDragging() {
    this.mouseDown$ = this.mouseDown$ || observableFromEvent(this.element.nativeElement, 'mousedown');
    this.mouseMove$ = this.mouseMove$ || observableFromEvent(document, 'mousemove') as Observable<MouseEvent>;
    this.mouseUp$ = this.mouseUp$ || observableFromEvent(document, 'mouseup') as Observable<MouseEvent>;

    this.drag$ = this.drag$ ||
                 this.mouseDown$.pipe(
                    switchMap(() => this.mouseMove$.pipe(
                      tap(this.onDrag.emit),
                      takeUntil(this.mouseUp$)
                    ))
                 );

    this.dragSubscription = this.drag$.subscribe((event: MouseEvent) => {
      this.element.nativeElement.style.left = `${event.x}px`;
      this.element.nativeElement.style.top = `${event.y}px`;
    });
  }
}
