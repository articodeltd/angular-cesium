import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EditablePolygonDrawerService {
  private polygons = new Map<string, any>();

  public points = new Subject<any>();
  public polylines = new Subject<any>();
  public entities = new Subject<any>();

  constructor() {

  }

  getPoints(): Observable<any> {
    return this.points;
  }

  getPolylines(): Observable<any> {
    return this.polylines
  }

  getEntities(): Observable<any> {
    return this.entities;
  }

}
