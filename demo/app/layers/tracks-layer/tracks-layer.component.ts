import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcNotification } from '../../../../src/models/ac-notification';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';
import { MapEventsManagerService } from '../../../../src/services/map-events-mananger/map-events-manager';
import { CesiumEvent } from '../../../../src/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../src/services/map-events-mananger/consts/pickOptions.enum';
import { AcEntity } from "../../../../src/models/ac-entity";

@Component({
    selector: 'tracks-layer',
    templateUrl: './tracks-layer.component.html',
    styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent implements OnInit {
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;

    tracks$: Observable<AcNotification>;
    Cesium = Cesium;
    showTracks = true;
    private lastPickTrack;
    private tracks = new Map<number, any>();

    constructor(private mapEventsManager: MapEventsManagerService) {
    }

    ngOnInit() {
        const socket = io.connect('http://localhost:3000');
        this.tracks$ = Observable.create((observer) => {
            socket.on('birds', (data) => {
                data.forEach(
                    (acNotification) => {
                        let action;
                        if (acNotification.action === 'ADD_OR_UPDATE') {
                            action = ActionType.ADD_UPDATE;
                        }
                        else if (acNotification.action === 'DELETE') {
                            action = ActionType.DELETE;
                        }
                        acNotification.actionType = action;
                        acNotification.entity = AcEntity.create(this.convertToCesiumObj(acNotification.entity));
                        const entity = acNotification.entity;
                        const track = this.tracks.get(acNotification.id);
                        if (!this.tracks.has(acNotification.id)) {
                            this.tracks.set(acNotification.id, entity);
                        }
                        else {
                            Object.assign(track, entity);
                            acNotification.entity = track;
                        }
                        observer.next(acNotification);
                    });
            });
        });

        const observable = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.PICK_FIRST,
            priority: 2,
        });
        observable.subscribe((event) => {
            const track = event.entities !== null ? event.entities[0] : null;
            if (this.lastPickTrack && (!track || track.id !== this.lastPickTrack.id)) {
                this.lastPickTrack.picked = false;
                this.layer.update({
                    entity: this.lastPickTrack,
                    actionType: ActionType.ADD_UPDATE,
                    id: this.lastPickTrack.id
                });
            }
            if (track && (!this.lastPickTrack || track.id !== this.lastPickTrack.id)) {
                track.picked = true;
                this.layer.update({ entity: track, actionType: ActionType.ADD_UPDATE, id: track.id });
            }
            this.lastPickTrack = track;
        });
    }

    getTrackColor(track) {
        if (track.picked) {
            return Cesium.Color.YELLOW;
        }
        else {
            return Cesium.Color.GREEN;
        }
    }

    convertToCesiumObj(entity): any {
        entity.scale = entity.id === 1 ? 0.3 : 0.15;
        entity.color = entity.id === 1 ? Cesium.Color.RED : undefined;
        entity.position = Cesium.Cartesian3.fromDegrees(entity.position.long, entity.position.lat);
        return entity;
    }

    removeAll() {
        this.layer.removeAll();
    }

    setShow($event) {
        this.showTracks = $event;
    }
}
