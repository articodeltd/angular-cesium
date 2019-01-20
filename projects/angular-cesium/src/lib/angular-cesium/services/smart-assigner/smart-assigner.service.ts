/**
 * Service for effective assignment.
 */
export class SmartAssigner {

  static create(props: string[] = [], allowUndefined: boolean = true): (obj1: Object, obj2: Object) => Object {
    let fnBody = ``;

    props.forEach(prop => {
      if (!allowUndefined) {
        // tslint:disable-next-line:max-line-length
        fnBody += `if (!(obj1['${prop}'] instanceof Cesium.CallbackProperty) && obj2['${prop}'] !== undefined) { obj1['${prop}'] = obj2['${prop}']; } `;
      } else {
        fnBody += `if(!(obj1['${prop}'] instanceof Cesium.CallbackProperty))obj1['${prop}'] = obj2['${prop}']; `;
      }
    });

    fnBody += `return obj1`;
    const assignFn = new Function('obj1', 'obj2', fnBody);

    return function smartAssigner(obj1: Object, obj2: Object) {
      return assignFn(obj1, obj2);
    };
  }
}
