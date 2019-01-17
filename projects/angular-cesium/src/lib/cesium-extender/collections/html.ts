import { HtmlPrimitive } from '../primitives';

export class HtmlCollection {
  private _collection: HtmlPrimitive[] = [];

  get length() {
    return this._collection.length;
  }

  get(index: number) {
    return this._collection[index];
  }

  add(options: any): HtmlPrimitive {
    const html = new HtmlPrimitive(options, this);
    this._collection.push(html);

    return html;
  }

  remove(html: HtmlPrimitive): boolean {
    const index = this._collection.indexOf(html);

    if (index === (-1)) {
      return false;
    }

    this._collection.splice(index, 1);
    return true;
  }

  update() {
    for (let i = 0, len = this._collection.length; i < len; i++) {
      this._collection[i].update();
    }
  }

  removeAll() {
    while (this._collection.length > 0) {
      this._collection.pop();
    }
  }

  contains(html: HtmlPrimitive): boolean {
    return Cesium.defined(html) && html.collection === this;
  }
}
