import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

@Component(
  {
    selector : 'ac-toolbar-button',
    template : `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `,
    styles : [`
        .button-container {
            border-radius: 1px;
            background-color: rgba(255, 255, 255, 0.8);
            height: 30px;
            width: 30px;
            padding: 5px;
            transition: all 0.2s;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .button-container:hover {
            background-color: rgba(255, 255, 255, 0.95);
        }
        
        .icon {
            height: 30px;
            width: 30px;
        }
    `],
    changeDetection : ChangeDetectionStrategy.OnPush,
  }
)
export class AcToolbarButtonComponent implements OnInit, OnDestroy {
  
  @Input()
  iconUrl: string;
  
  @Input()
  buttonClass: string;
  
  
  @Input()
  iconClass: string;
  
  @Output()
  onClick = new EventEmitter();
  
  private subscription;
  
  constructor() {
  }
  
  ngOnInit() {
  
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  
  
}
