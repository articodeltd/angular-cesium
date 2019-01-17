import { from as observableFrom, Observable } from 'rxjs';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';

@Component({
  selector: 'html-layer',
  templateUrl: './html-layer.component.html',
  styleUrls: ['./html-layer.component.css']
})
export class HtmlLayerComponent implements OnInit, AfterViewInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  htmls$: Observable<AcNotification>;

  constructor() {
    const html1 = {
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

    const html2 = {
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

    const htmlArray = [html1, html2];
    this.htmls$ = observableFrom(htmlArray);

    setTimeout(() => {
      html1.entity.name = 'tsahi';
      this.layer.update(html1, html1.id);

      html2.entity.name = 'gonen';
      html2.entity.position = Cesium.Cartesian3.fromDegrees(44, 44);
      this.layer.update(html2, html2.id);
    }, 5000);

    setTimeout(() => {
      this.layer.refreshAll(htmlArray);
    }, 10000);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  changeText(html: any, text: any) {
    html.name = text;
    this.layer.update(html, html.id);
  }

  pixelOffset(value) {
    return new Cesium.Cartesian2(value[0], value[1]);
  }
}
