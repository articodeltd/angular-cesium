export interface IDescription {
  draw(context: any, id: string, contextEntity: any): void;

  remove(id: string): void;

  removeAll(): void;
}
