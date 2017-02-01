import {ActionType} from "./action-type.enum";
import {AcEntity} from "./ac-entity";
export interface AcNotification {
    id : number,
    entity?: AcEntity;
    actionType: ActionType;
}