import { Component } from '@angular/core';
import { BasicContextMenu } from 'angular-cesium';

@Component({
  template: `
      <div class="container">
          <div *ngFor="let item of data.items" class="item">{{item}}</div>
      </div>
  `,
  styles: [`
      .container {
          background-color: rgba(140, 140, 140, 0.8);
      }

      .item {
          padding: 10px;
          color: white;
      }

      .item:hover {
          cursor: pointer;
          background-color: rgba(50, 150, 255, 0.6);

      }
  `],
  selector: 'context-menu',
})
export class ContextMenuComponent implements BasicContextMenu {
  data: any;
}
