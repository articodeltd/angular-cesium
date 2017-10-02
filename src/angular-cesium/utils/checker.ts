export class Checker {
	static throwIfAnyNotPresent(values: Object, propertyNames: string[]) {
		propertyNames.forEach(propertyName => Checker.throwIfNotPresent(values, propertyName));
	}

	static throwIfNotPresent(value: any, name: string) {
		if (!Checker.present(value[name])) {
			throw new Error(`Error: ${name} was not given.`);
		}
	}

	static present(value: any) {
		return value !== undefined && value !== null;
	}
}
