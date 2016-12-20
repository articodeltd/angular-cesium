import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { LayerContext } from './angular-cesium/decorators/layer-context.decorator';
import {Observable} from "rxjs";
import {Parser, Lexer} from '@angular/compiler';
import {A2Parse} from './angular-cesium/services/a2-parse/a2-parse.service';

@LayerContext()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Parser, Lexer, A2Parse]
})
export class AppComponent implements OnInit{
  title: string = 'app works!';
  track: any;
  tracks$: Observable<any>;
  staticPosition: Object;
  staticColor: Object;

  constructor(private cd: ChangeDetectorRef, private a2Parse: A2Parse){
    this.track = {getImage: () => '', getPosition: () => ''};
    this.staticPosition = Cesium.Cartesian3.fromDegrees(-72.59777, 38.03883);
    this.staticColor = Cesium.Color.RED;
  }

  ngOnInit(){
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

    //const result1 = this.a2Parse.$parse("getPosition()['x']")({getPosition(){return {x: 5};}});

    //const result1 = this.a2Parse.$parse("getPosition()")({
    //  getPosition(){
    //    return {
    //      x: 5,
    //      getNumber() {
    //        return {x: 7};
    //      }
    //    };
    //  }});


    const context = {getPosition(){return {x: 5};}};

    //const result = this.a2Parse.$parse(`getPosition() | json`)(context);
    const result = this.a2Parse.$evalParse(`getPosition() | json`)(context);

     this.tracks$ = Observable.from([
       {
         id: 1,
         action: 'ADD_OR_UPDATE',
         entity: {
           name: 'tomer',
           getImage: () => "/assets/14141771_10210342250822703_4768968253746041744_n.jpg",
           getPosition: () => Cesium.Cartesian3.fromDegrees(-25.59777, 80.03883)
         }
       },
       {
         id: 2,
         action: 'ADD_OR_UPDATE',
         entity: {
           name: 'onen',
           getImage: () => "/assets/bear-tongue_1558824i.jpg",
           getPosition: () => Cesium.Cartesian3.fromDegrees(-45.59777, 20.03883)
         }
       },
        {
         id: 2,
         action: 'ADD_OR_UPDATE',
         entity: {
            name: 'eitan',
           getImage: () => "/assets/bear-tongue_1558824i.jpg",
           getPosition: () => Cesium.Cartesian3.fromDegrees(-40.59777, 15.03883)
         }
       }
     ]);
  }
}
