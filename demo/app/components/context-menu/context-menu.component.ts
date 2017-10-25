import { Component } from '@angular/core';
import { BasicContextMenu } from '../../../../src/angular-cesium/models/basic-context-menu';

@Component({
  template: `
      <div class="container">
          <div *ngFor="let item of data.items" class="item">{{item}}</div>
      </div>
  `,
  styles: [`
      .container {
          background-color: rgba(140, 140, 140, 0.3);
      }

      .item:hover {
          background-color: rgba(255, 255, 255, 0.6);
      }
  `],
  selector: 'context-menu',
})
export class ContextMenuComponent implements BasicContextMenu {
  data: any;
}
