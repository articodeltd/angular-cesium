import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
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
    selector : 'ac-toolbar',
    template : `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `,
    styles : [`
        :host {
            position: absolute;
            top: 100px;
            left: 20px;
            width: 20px;
            height: 20px;
            -webkit-user-drag: none;
        }
    `],
    changeDetection : ChangeDetectionStrategy.OnPush,
  }
)
export class AcToolbarComponent implements OnInit, OnDestroy {
  @Input()
  toolbarClass: string;
  @Input()
  allowDrag = true;
  
  dragStyle = {
    'height.px' : 20,
    'width.px' : 20,
  };
  
  private subscription: Subscription;
  
  constructor(private element: ElementRef) {
  }
  
  ngOnInit() {
    
    if (this.allowDrag) {
      const mouseDown$ = Observable.fromEvent(this.element.nativeElement, 'mousedown');
      const mouseMove$ = Observable.fromEvent(document, 'mousemove');
      const mouseUp$ = Observable.fromEvent(document, 'mouseup');
      
      const drag$ = mouseDown$.switchMap(() => mouseMove$.takeUntil(mouseUp$));
      
      this.subscription = drag$.subscribe((event: MouseEvent) => {
        this.element.nativeElement.style.left = event.x + 'px';
        this.element.nativeElement.style.top = event.y + 'px';
      })
    }
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  
  
}
