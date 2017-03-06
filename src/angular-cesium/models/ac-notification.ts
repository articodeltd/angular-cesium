import { ActionType } from './action-type.enum';
import { AcEntity } from './ac-entity';

/**
 * Interface of  Angular2Cesium notification.
 */
export interface AcNotification {
	id: number;
	entity?: AcEntity;
	actionType: ActionType;
}
