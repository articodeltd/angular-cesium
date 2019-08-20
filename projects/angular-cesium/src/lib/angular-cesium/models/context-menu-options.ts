/**
 * Interface of context menu options that can be passed when opening a context menu.
 */

export interface ContextMenuOptions<D = any> {
  data?: D;
  closeOnLeftCLick?: boolean;
  closeOnLeftClickPriority?: number;
}
