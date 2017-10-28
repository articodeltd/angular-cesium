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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HippodromeEditOptions } from '../../../models/hippodrome-edit-options';
import { HippodromeManagerService } from './hippodrome-manager.service';

export const DEFAULT_HIPPODROME_OPTIONS: HippodromeEditOptions = {
	addPointEvent : CesiumEvent.LEFT_CLICK,
	dragPointEvent : CesiumEvent.LEFT_CLICK_DRAG,
	hippodromeProps : {
		material : Cesium.Color.GREEN.withAlpha(0.5),
		width : 200000.0,
		outline : false,
	},
};

/**
 * Service for creating editable hippodromes
 *
 * usage:
 * ```typescript
 *  // Start creating hippodrome
 *  const editing$ = hippodromeEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit hippodromes from existing hippodromes cartesian3 positions
 *  const editing$ = this.hippodromeEditor.edit(initialPos);
 *
 * ```
 */
@Injectable()
export class HippodromeEditorService {
	private mapEventsManager: MapEventsManagerService;
	private updateSubject = new Subject<PolygonEditUpdate>();
	private updatePublisher = this.updateSubject.publish(); // TODO maybe not needed
	private counter = 0;
	private coordinateConverter: CoordinateConverter;
	private cameraService: CameraService;
	private hippodromeManager: HippodromeManagerService;
	
	init(mapEventsManager: MapEventsManagerService,
			 coordinateConverter: CoordinateConverter,
			 cameraService: CameraService,
			 managerService: HippodromeManagerService) {
		this.mapEventsManager = mapEventsManager;
		this.updatePublisher.connect();
		this.coordinateConverter = coordinateConverter;
		this.cameraService = cameraService;
		this.hippodromeManager = managerService;
		
	}
	
	onUpdate(): Observable<PolygonEditUpdate> {
		return this.updatePublisher;
	}
	
	create(options = DEFAULT_HIPPODROME_OPTIONS, eventPriority = 100): EditorObservable<PolygonEditUpdate> {
		const positions: Cartesian3[] = [];
		const id = this.generteId();
		const hippodromeOptions = this.setOptions(options);
		
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
			polygonOptions : hippodromeOptions,
		});
		
		const mouseMoveRegistration = this.mapEventsManager.register({
			event : CesiumEvent.MOUSE_MOVE,
			pick : PickOptions.NO_PICK,
			priority : eventPriority,
		});
		const addPointRegistration = this.mapEventsManager.register({
			event : hippodromeOptions.addPointEvent,
			pick : PickOptions.NO_PICK,
			priority : eventPriority,
		});
		const editorObservable = this.createEditorObservable(
			clientEditSubject,
			[mouseMoveRegistration, addPointRegistration],
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
			
			if (this.getPositions(id).length === 2) {
				const changeMode = {
					id,
					editMode : EditModes.CREATE,
					editAction : EditActions.CHANGE_TO_EDIT,
				};
				this.updateSubject.next(changeMode);
				clientEditSubject.next(changeMode);
				mouseMoveRegistration.dispose();
				addPointRegistration.dispose();
				this.editHippdrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
				finishedCreate = true;
			}
		});
		
		return editorObservable;
	}
	
	private setOptions(options: HippodromeEditOptions): HippodromeEditOptions {
		const defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
		const polygonOptions = Object.assign(defaultClone, options);
		polygonOptions.defaultPointOptions = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
		return polygonOptions;
	}
	
	edit(positions: Cartesian3[], options = DEFAULT_HIPPODROME_OPTIONS, priority = 100): EditorObservable<PolygonEditUpdate> {
		if (positions.length !== 2) {
			throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
		}
		const id = this.generteId();
		const hippodromeEditOptions = this.setOptions(options);
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
			polygonOptions : hippodromeEditOptions,
		};
		this.updateSubject.next(update);
		editSubject.next({
			...update,
			positions : this.getPositions(id),
			points : this.getPoints(id),
		});
		return this.editHippdrome(
			id,
			priority,
			editSubject,
			hippodromeEditOptions
		)
	}
	
	private editHippdrome(id: string,
												priority,
												editSubject: Subject<PolygonEditUpdate>,
												options: HippodromeEditOptions,
												editObservable?: EditorObservable<PolygonEditUpdate>) {
		
		const pointDragRegistration = this.mapEventsManager.register({
			event : options.dragPointEvent,
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
		
		
		return editObservable || this.createEditorObservable(editSubject,
			[pointDragRegistration],
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
		return 'edit-hippodrome-' + this.counter++;
	}
	
	private getPositions(id) {
		const polyline = this.hippodromeManager.get(id);
		return polyline.getRealPositions()
	}
	
	private getPoints(id) {
		const polyline = this.hippodromeManager.get(id);
		return polyline.getRealPoints();
	}
}
