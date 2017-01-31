
export default class Checker{
    static throwIfAnyNotPresent(values:Object, propertyNames:string[]){
        propertyNames.forEach(propertyName => Checker.throwIfNotPresent(values[propertyName], propertyName))
    }

    static throwIfNotPresent(value:any, name:string){
        if (!Checker.present(value)){
            throw `Error: ${name} was not given.`;
        }
    }

    private static present(value: any) {
        return value !== undefined && value !== null;
    }
}