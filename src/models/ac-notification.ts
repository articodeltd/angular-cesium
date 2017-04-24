import { ActionType } from './action-type.enum';
import { AcEntity } from './ac-entity';

/**
 * Interface of  Angular2Cesium notification.
 * ac-layer receives an observer of AcNotifications
 */
export interface AcNotification {
	id: number;
	entity?: AcEntity;
	actionType: ActionType;
}

export class AcNotification {
	id: number;
	entity?: AcEntity;
	actionType: ActionType;
}
