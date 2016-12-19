import {LayerContextService} from '../layer-context/layer-context.service';

export class BasicLayer {

    constructor(private _layerContext: LayerContextService) {
        this._layerContext.setContext(this);
    }
}