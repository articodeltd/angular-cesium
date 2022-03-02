import { from, from as observableFrom, Observable, Subject } from 'rxjs';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Cartesian3, Cartesian2, Color } from 'cesium';
import { AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';

@Component({
  selector: 'html-layer-example',
  templateUrl: './html-example.component.html',
  styleUrls: ['./html-example.component.css']
})
export class HtmlExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;
  htmls$: Observable<AcNotification>;

  html1 = {
    id: '0',
    actionType: ActionType.ADD_UPDATE,
    entity: {
      id: '0',
      show: true,
      name: 'html 1',
      position: Cartesian3.fromDegrees(30, 30),
      color: Color.RED
    },
  };
  html2 = {
    id: '1',
    actionType: ActionType.ADD_UPDATE,
    entity: {
      id: '1',
      show: true,
      name: 'html 2',
      position: Cartesian3.fromDegrees(35, 35),
      color: Color.RED
    }
  };

  constructor() {
    const htmlArray = [this.html1, this.html2];
    this.htmls$ = from(htmlArray);
  }

  ngOnInit() {
  }

  updateHtml() {
    if (this.html1) {
      this.html1.entity.name = 'tsahi';
      this.layer.update(this.html1.entity, this.html1.id);
    }

    this.html2.entity.name = 'gonen';
    this.html2.entity.position = Cartesian3.fromDegrees(44, 44);
    this.layer.update(this.html2.entity, this.html2.id);
  }

  changeText(html: any, text: any) {
    html.name = text;
    this.layer.update(html, html.id);
  }

  pixelOffset(value) {
    return new Cartesian2(value[0], value[1]);
  }

  removeFirst() {
    this.layer.remove('0');
    this.html1 = null;
  }

  toggleShow() {
    if (this.html1) {
      this.html1.entity.show = !this.html1.entity.show;
      this.layer.update(this.html1.entity, this.html1.id);
    }
  }
}
