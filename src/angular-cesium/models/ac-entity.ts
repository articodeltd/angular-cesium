import {ActionType} from "./action-type.enum";
export interface AcEntity{
    id : number,
    entity?: any;
    actionType: ActionType;
}