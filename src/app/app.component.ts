import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {LayerContext} from './angular-cesium/decorators/layer-context.decorator';
import {Observable} from "rxjs";
import {Parse} from "./angular2-parse/src/services/parse/parse.service";
import {LayerContextService} from './angular-cesium/services/layer-context/layer-context.service';
import {BasicLayer} from "./angular-cesium/services/basic-layer/basic-layer.service";

@LayerContext()
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [Parse]
})
export class AppComponent extends BasicLayer implements OnInit {
    title: string = 'app works!';
    track: any;
    tracks$: Observable<any>;
    staticPosition: Object;
    staticColor: Object;
    Cesium = Cesium;

    constructor(private cd: ChangeDetectorRef,
                private parse: Parse,
                layerContext: LayerContextService) {
        super(layerContext);
        this.track = {getImage: () => '', getPosition: () => ''};
        this.staticPosition = Cesium.Cartesian3.fromDegrees(-72.59777, 38.03883);
        this.staticColor = Cesium.Color.RED;
    }

    ngOnInit() {
        //let thousandStream = Observable.range(0, 30000);
        //this.tracks$ = thousandStream.map((value)=>({
        //    id: value,
        //    action: 'ADD_OR_UPDATE',
        //    entity: {
        //      name: 'tomer',
        //      getImage: () => "/assets/14141771_10210342250822703_4768968253746041744_n.jpg",
        //      getPosition: () => Cesium.Cartesian3.fromDegrees(Math.random() * 80, Math.random() * 80)
        //  }
        //}));

    //const context = {getPosition(){return {x: 5};}};

    //const result = this.parse.$parse(`getPosition() | json`)(context);
    //const result1 = this.parse.$evalParse(`getPosition() | json`)(context);

        //     this.tracks$ = Observable.from([
        //         {
        //             id: 1,
        //             action: 'ADD_OR_UPDATE',
        //             entity: {
        //                 name: 'tomer',
        //                 getImage: () => "/assets/14141771_10210342250822703_4768968253746041744_n.jpg",
        //                 getPosition: () => Cesium.Cartesian3.fromDegrees(-25.59777, 80.03883)
        //             }
        //         },
        //         {
        //             id: 2,
        //             action: 'ADD_OR_UPDATE',
        //             entity: {
        //                 name: 'onen',
        //                 getImage: () => "/assets/bear-tongue_1558824i.jpg",
        //                 getPosition: () => Cesium.Cartesian3.fromDegrees(-45.59777, 20.03883)
        //             }
        //         },
        //         {
        //             id: 2,
        //             action: 'ADD_OR_UPDATE',
        //             entity: {
        //                 name: 'eitan',
        //                 getImage: () => "/assets/bear-tongue_1558824i.jpg",
        //                 getPosition: () => Cesium.Cartesian3.fromDegrees(-40.59777, 15.03883)
        //             }
        //         }
        //     ]);

        var socket = io.connect('http://localhost:3000');
        this.tracks$ = Observable.create((observer) => {
            socket.on('birds', (data) => {
                data.forEach((entity) => {
                    entity.entity = this.convertToCesiumObj(entity)
                    observer.next(entity);
                });
            });
        })
    }

    convertToCesiumObj(data): any {
        return {
            image: data.entity.image,
            scale: data.id === 1 ? 0.3 : 0.15,
            color: data.id === 1 ? Cesium.Color.RED : undefined,
            position: Cesium.Cartesian3.fromRadians(Math.random(), Math.random())
        }
    }
}
