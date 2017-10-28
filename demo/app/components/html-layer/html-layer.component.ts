import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcNotification } from '../../../../src/angular-cesium/models/ac-notification';
import { ActionType } from '../../../../src/angular-cesium/models/action-type.enum';
import { AcLayerComponent } from '../../../../src/angular-cesium/components/ac-layer/ac-layer.component';

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
        this.htmls$ = Observable.from(htmlArray);

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

    changeText(html, text) {
        html.name = text;
        this.layer.update(html, html.id);
    }
}