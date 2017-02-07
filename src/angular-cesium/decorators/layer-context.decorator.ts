import { LayerContextService } from '../services/layer-context/layer-context.service';

export function LayerContext() {
	return function (target: Function) {
		const reflect = window['Reflect'];
		if (reflect.getOwnMetadata('annotations', target)[0].providers === undefined) {
			reflect.getOwnMetadata('annotations', target)[0].providers = [LayerContextService]
		}
		else {
			reflect.getOwnMetadata('annotations', target)[0].providers.push(LayerContextService);
		}
	}
}
