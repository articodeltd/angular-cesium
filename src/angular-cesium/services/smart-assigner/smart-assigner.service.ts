/**
 * Service for effective assignment.
 */
export class SmartAssigner {

    static create(props: string[] = [], allowUndefined: boolean = true): (obj1: Object, obj2: Object) => Object {
        let fnBody = ``;

        props.forEach(prop => {
            if (!allowUndefined) {
                fnBody += `if (obj2['${prop}'] !== undefined) { obj1['${prop}'] = obj2['${prop}']; } `;
            }
            else {
                fnBody += `obj1['${prop}'] = obj2['${prop}']; `;
            }
        });

        fnBody += `return obj1`;
        const assignFn = new Function('obj1', 'obj2', fnBody);

        return function smartAssigner(obj1: Object, obj2: Object) {
            return assignFn(obj1, obj2);
        };
    }
}
