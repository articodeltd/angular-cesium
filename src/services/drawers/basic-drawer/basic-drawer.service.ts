export abstract class BasicDrawerService {
  protected cesiumCollection: any;
  protected _propsAssigner: Function;

  constructor() {
  }

  abstract add(cesiumProps: any, ...args)

  abstract update(primitive: any, cesiumProps: any, ...args)

  abstract remove(primitive: any)

  abstract removeAll()

  abstract setShow(showValue: boolean)

  setPropsAssigner(assigner: Function) {
    this._propsAssigner = assigner;
  }
}
