export abstract class BasicDrawerService {
  protected _propsAssigner: Function;

  constructor() {
  }

  abstract add(cesiumProps: any, ...args)

  abstract update(primitive: any, cesiumProps: any, ...args)

  abstract remove(primitive: any)

  abstract removeAll()

  abstract setShow(showValue: boolean)

  abstract init(options?: any)

  setPropsAssigner(assigner: Function) {
    this._propsAssigner = assigner;
  }
}
