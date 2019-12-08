import { Component } from '@angular/core';
import { BasicContextMenu } from 'angular-cesium';

export interface ContextMenuData {
  item: { name: string };
  onActionClick: () => void;
}

@Component({
  template: `
      <div class="container">
          <div (click)="data.onActionClick()" class="item">Remove {{data.item.name}}</div>
          <div (click)="data.onActionClick()" class="item">Update {{data.item.name}}</div>
          <div (click)="data.onActionClick()" class="item">Do Something</div>
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
  selector: 'my-custom-context-menu',
})
export class MyCustomContextMenuComponent implements BasicContextMenu {
  data: ContextMenuData; // data will be injected from the ContextMenuService.open()
}
