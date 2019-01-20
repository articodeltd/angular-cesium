import { Injectable } from '@angular/core';
import { JsonStringMapper } from 'json-string-mapper';

@Injectable()
export class JsonMapper {
  private _mapper: JsonStringMapper;

  constructor() {
    this._mapper = new JsonStringMapper();
  }

  map(expression: string): Map<string, string> {
    return this._mapper.map(expression);
  }
}
