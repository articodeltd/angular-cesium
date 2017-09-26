// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
// import { BasicDrawerService } from '../../../../src/services/drawers/basic-drawer/basic-drawer.service';
// import { MapEventsManagerService } from '../../../../src/services/map-events-mananger/map-events-manager';
//
// export class BasicEntitiesEditorHandler {
//   private updateSubject = new Subject<any>();
//   private addedSubject = new Subject<any>();
//   private removedSubject = new Subject<any>();
//   private changesSubject = new Subject<any>();
//   private points = [];
//
//   constructor(private drawer: BasicDrawerService, private mapEventsManager: MapEventsManagerService) {
//
//   }
//
//   pasueEdit() {
//
//   }
//
//   edit() {
//
//   }
//
//   dispose() {
//
//   }
//
//   onUpdate(): Observable<any> {
//     return this.updateSubject;
//   }
//
//   onPointAdded(): Observable<any> {
//     return this.addedSubject;
//   }
//
//   onPointRemoved(): Observable<any> {
//     return this.removedSubject;
//   }
//
//   subscribe(): Observable<any> {
//     return this.changesSubject;
//   }
//
//   finish() {
//
//   }
// }