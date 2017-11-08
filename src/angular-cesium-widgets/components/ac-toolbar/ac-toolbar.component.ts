import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component(
  {
    selector : 'ac-toolbar',
    template : `
       <div>
           <ng-content></ng-content>
       </div>
    `,
    styles : [`
    
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
  }
)
export class AcToolbarComponent implements OnInit {
  
  ngOnInit() {
  }
  
}
