import {ActionType} from "./action-type.enum";
export interface AcNotification {
    id : number,
    entity?: any;
    actionType: ActionType;
}