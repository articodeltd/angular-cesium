import { Injectable } from '@angular/core';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { PolygonEditUpdate } from '../../../models/polygon-edit-update';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { DisposableObservable } from '../../../../angular-cesium/services/map-events-mananger/disposable-observable';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from '../../../models/edit-point';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { EditorObservable } from '../../../models/editor-observable';
import { PolygonsManagerService } from './polygons-manager.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';

const DEFAULT_OPTIONS: PolygonEditOptions = {
	addPointEvent : CesiumEvent.LEFT_CLICK,
	addLastPointEvent : CesiumEvent.LEFT_DOUBLE_CLICK,
	removePointEvent : CesiumEvent.RIGHT_CLICK,
	dragPointEvent : CesiumEvent.LEFT_CLICK_DRAG,
	defaultPointOptions : {
		color : Cesium.Color.WHITE,
		outlineColor : Cesium.Color.BLACK,
		outlineWidth : 1,
	},
	defaultPolygonOptions : {
		material : new Cesium.Color(0.1, 0.5, 0.2, 0.4),
	}
};

/**
 * Service for creating editable polygons
 *
 * usage:
 * ```typescript
 *  // Start creating polygon
 *  const editing$ = polygonsEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polygon from existing polygon positions
 *  const editing$ = this.polygonsEditor.edit(initialPos);
 *
 * ```
 */
@Injectable()
export class PolygonsEditorService {
	private mapEventsManager: MapEventsManagerService;
	private updateSubject = new Subject<PolygonEditUpdate>();
	private updatePublisher = this.updateSubject.publish(); // TODO maybe not needed
	private counter = 0;
	private coordinateConverter: CoordinateConverter;
	private cameraService: CameraService;
	private polygonsManager: PolygonsManagerService;
	
	init(mapEventsManager: MapEventsManagerService,
			 coordinateConverter: CoordinateConverter,
			 cameraService: CameraService,
			 polygonsManager: PolygonsManagerService) {
		this.mapEventsManager = mapEventsManager;
		this.updatePublisher.connect();
		this.coordinateConverter = coordinateConverter;
		this.cameraService = cameraService;
		this.polygonsManager = polygonsManager;
		
	}
	
	onUpdate(): Observable<PolygonEditUpdate> {
		return this.updatePublisher;
	}
	
	create(options = DEFAULT_OPTIONS, priority = 100): EditorObservable<PolygonEditUpdate> {
		const positions: Cartesian3[] = [];
		const id = this.generteId();
		const polygonOptions = this.setOptions(options);
		
		const clientEditSubject = new BehaviorSubject<PolygonEditUpdate>({
			id,
			editAction : null,
			editMode : EditModes.CREATE
		});
		let finishedCreate = false;
		
		this.updateSubject.next({
			id,
			positions,
			editMode : EditModes.CREATE,
			editAction : EditActions.INIT,
			polygonOptions : polygonOptions,
		});
		
		const mouseMoveRegistration = this.mapEventsManager.register({
			event : CesiumEvent.MOUSE_MOVE,
			pick : PickOptions.NO_PICK,
			priority,
		});
		const addPointRegistration = this.mapEventsManager.register({
			event : polygonOptions.addPointEvent,
			pick : PickOptions.NO_PICK,
			priority,
		});
		const addLastPointRegistration = this.mapEventsManager.register({
			event : polygonOptions.addLastPointEvent,
			pick : PickOptions.NO_PICK,
			priority,
		});
		const editorObservable = this.createEditorObservable(
			clientEditSubject,
			[mouseMoveRegistration, addPointRegistration, addLastPointRegistration],
			id);
		
		mouseMoveRegistration.subscribe(({movement : {endPosition}}) => {
			const position = this.coordinateConverter.screenToCartesian3(endPosition);
			
			if (position) {
				this.updateSubject.next({
					id,
					positions : this.getPositions(id),
					editMode : EditModes.CREATE,
					updatedPosition : position,
					editAction : EditActions.MOUSE_MOVE,
				});
			}
		});
		
		addPointRegistration.subscribe(({movement : {endPosition}}) => {
			if (finishedCreate) {
				return;
			}
			const position = this.coordinateConverter.screenToCartesian3(endPosition);
			if (!position) {
				return;
			}
			const allPositions = this.getPositions(id);
			if (allPositions.find((cartesian) => cartesian.equals(position))) {
				return;
			}
			
			const updateValue = {
				id,
				positions : allPositions,
				editMode : EditModes.CREATE,
				updatedPosition : position,
				editAction : EditActions.ADD_POINT,
			};
			this.updateSubject.next(updateValue);
			clientEditSubject.next({
				...updateValue,
				positions : this.getPositions(id),
				points : this.getPoints(id),
			});
		});
		
		
		addLastPointRegistration.subscribe(({movement : {endPosition}}) => {
			const position = this.coordinateConverter.screenToCartesian3(endPosition);
			if (!position) {
				return;
			}
			// position already added by addPointRegistration
			const updateValue = {
				id,
				positions : this.getPositions(id),
				editMode : EditModes.CREATE,
				updatedPosition : position,
				editAction : EditActions.ADD_LAST_POINT,
			};
			this.updateSubject.next(updateValue);
			clientEditSubject.next({
				...updateValue,
				positions : this.getPositions(id),
				points : this.getPoints(id),
			});
			
			const changeMode = {
				id,
				editMode : EditModes.CREATE,
				editAction : EditActions.CHANGE_TO_EDIT,
			};
			this.updateSubject.next(changeMode);
			clientEditSubject.next(changeMode);
			mouseMoveRegistration.dispose();
			addPointRegistration.dispose();
			addLastPointRegistration.dispose();
			this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
			finishedCreate = true;
		});
		
		return editorObservable;
	}
	
	private setOptions(options: PolygonEditOptions) {
		const defaultClone = JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
		const polygonOptions = Object.assign(defaultClone, options);
		polygonOptions.defaultPointOptions = Object.assign({}, DEFAULT_OPTIONS.defaultPointOptions, options.defaultPointOptions);
		polygonOptions.defaultPolygonOptions = Object.assign({}, DEFAULT_OPTIONS.defaultPolygonOptions, options.defaultPolygonOptions);
		return polygonOptions;
	}
	
	edit(positions: Cartesian3[], options = DEFAULT_OPTIONS, priority = 100): EditorObservable<PolygonEditUpdate> {
		if (positions.length < 3) {
			throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
		}
		const id = this.generteId();
		const polygonOptions = this.setOptions(options);
		const editSubject = new BehaviorSubject<PolygonEditUpdate>({
			id,
			editAction : null,
			editMode : EditModes.EDIT
		});
		const update = {
			id,
			positions : positions,
			editMode : EditModes.EDIT,
			editAction : EditActions.INIT,
			polygonOptions : polygonOptions,
		};
		this.updateSubject.next(update);
		editSubject.next({
			...update,
			positions : this.getPositions(id),
			points : this.getPoints(id),
		});
		return this.editPolygon(
			id,
			positions,
			priority,
			editSubject,
			polygonOptions
		)
	}
	
	private editPolygon(id: string,
											positions: Cartesian3[],
											priority,
											editSubject: Subject<PolygonEditUpdate>,
											options: PolygonEditOptions,
											editObservable?: EditorObservable<PolygonEditUpdate>) {
		
		const pointDragRegistration = this.mapEventsManager.register({
			event : options.dragPointEvent,
			entityType : EditPoint,
			pick : PickOptions.PICK_FIRST,
			priority,
		});
		const pointRemoveRegistration = this.mapEventsManager.register({
			event : options.removePointEvent,
			entityType : EditPoint,
			pick : PickOptions.PICK_FIRST,
			priority,
		});
		
		pointDragRegistration
			.do(({movement : {drop}}) => this.cameraService.enableInputs(drop))
			.subscribe(({movement : {endPosition, drop}, entities}) => {
				const position = this.coordinateConverter.screenToCartesian3(endPosition);
				if (!position) {
					return;
				}
				const point: EditPoint = entities[0];
				
				const update = {
					id,
					positions : this.getPositions(id),
					editMode : EditModes.EDIT,
					updatedPosition : position,
					updatedPoint : point,
					editAction : drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
				};
				this.updateSubject.next(update);
				editSubject.next({
					...update,
					positions : this.getPositions(id),
					points : this.getPoints(id),
				});
			});
		
		pointRemoveRegistration.subscribe(({entities}) => {
			const point: EditPoint = entities[0];
			const allPositions = [...this.getPositions(id)];
			if (allPositions.length < 4) {
				return;
			}
			const index = allPositions.findIndex(position => point.getPosition().equals(position as Cartesian3));
			if (index < 0) {
				return;
			}
			
			const update = {
				id,
				positions : allPositions,
				editMode : EditModes.EDIT,
				updatedPoint : point,
				editAction : EditActions.REMOVE_POINT,
			};
			this.updateSubject.next(update);
			editSubject.next({
				...update,
				positions : this.getPositions(id),
				points : this.getPoints(id),
			});
		});
		
		return editObservable || this.createEditorObservable(editSubject,
			[pointDragRegistration, pointRemoveRegistration],
			id);
	}
	
	
	private createEditorObservable(observableToExtend: any,
																 disposableObservables: DisposableObservable<any>[],
																 id: string): EditorObservable<PolygonEditUpdate> {
		observableToExtend.dispose = () => {
			disposableObservables.forEach(obs => obs.dispose());
			this.updateSubject.next({
				id,
				positions : this.getPositions(id),
				editMode : EditModes.CREATE_OR_EDIT,
				editAction : EditActions.DISPOSE,
			});
		};
		observableToExtend.enable = () => {
			this.updateSubject.next({
				id,
				positions : this.getPositions(id),
				editMode : EditModes.EDIT,
				editAction : EditActions.ENABLE,
			});
		};
		observableToExtend.disable = () => {
			this.updateSubject.next({
				id,
				positions : this.getPositions(id),
				editMode : EditModes.EDIT,
				editAction : EditActions.DISABLE,
			});
		};
		observableToExtend.setPointsManually = (points: EditPoint[]) => {
			this.updateSubject.next({
				id,
				positions : points.map(p => p.getPosition()),
				points : points,
				editMode : EditModes.EDIT,
				editAction : EditActions.SET_MANUALLY,
			});
			observableToExtend.next({
				id,
				positions : this.getPositions(id),
				points : this.getPoints(id),
				editMode : EditModes.EDIT,
				editAction : EditActions.SET_MANUALLY,
			})
		};
		observableToExtend.getCurrentPoints = () => this.getPoints(id);
		
		observableToExtend.polygonEditValue = () => observableToExtend.getValue();
		
		return observableToExtend as EditorObservable<PolygonEditUpdate>;
	}
	
	private generteId(): string {
		return 'edit-polygon-' + this.counter++;
	}
	
	private getPositions(id) {
		const polygon = this.polygonsManager.get(id);
		return polygon.getRealPositions()
	}
	
	private getPoints(id) {
		const polygon = this.polygonsManager.get(id);
		return polygon.getRealPoints();
	}
}
