import {LayerContextService} from "../services/layer-context/layer-context.service";

export function LayerContext() {
    return function (target: Function) {
        const reflect  = window['Reflect'];
        reflect.getOwnMetadata('annotations',target)[0].providers.push(LayerContextService);
    }
}
