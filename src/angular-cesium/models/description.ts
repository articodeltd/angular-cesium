export interface IDescription {
  draw(context, id: string, contextEntity);
  remove(id: string);
  removeAll();
}
