import { from as observableFrom, Observable } from 'rxjs';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';

@Component({
  selector: 'html-layer-example',
  templateUrl: './html-example.component.html',
  styleUrls: ['./html-example.component.css']
})
export class HtmlExampleComponent implements OnInit, AfterViewInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  htmls$: Observable<AcNotification>;

  html1 = {
    id: '0',
    actionType: ActionType.ADD_UPDATE,
    entity: {
      id: '0',
      show: true,
      name: 'html 1',
      position: Cesium.Cartesian3.fromDegrees(30, 30),
      color: Cesium.Color.RED
    },
  };
  html2 = {
    id: '1',
    actionType: ActionType.ADD_UPDATE,
    entity: {
      id: '1',
      show: true,
      name: 'html 2',
      position: Cesium.Cartesian3.fromDegrees(35, 35),
      color: Cesium.Color.RED
    }
  };

  constructor() {


    const htmlArray = [this.html1, this.html2];
    this.htmls$ = observableFrom(htmlArray);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  updateHtml() {
    this.html1.entity.name = 'tsahi';
    this.layer.update(this.html1.entity, this.html1.id);

    this.html2.entity.name = 'gonen';
    this.html2.entity.position = Cesium.Cartesian3.fromDegrees(44, 44);
    this.layer.update(this.html2.entity, this.html2.id);
  }

  changeText(html: any, text: any) {
    html.name = text;
    this.layer.update(html, html.id);
  }

  pixelOffset(value) {
    return new Cesium.Cartesian2(value[0], value[1]);
  }

  removeFirst() {
    this.layer.remove('0');
  }
}
