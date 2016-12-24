import {ActionType} from "./action-type.enum";
export interface acEntity{
    id : number,
    entity?: any;
    actionType: ActionType;
}