import * as i0 from "@angular/core";
export declare class AcHtmlManager {
    private _entities;
    constructor();
    has(id: string): boolean;
    get(id: string): {
        entity: any;
        primitive: any;
    };
    addOrUpdate(id: any, info: {
        entity: any;
        primitive: any;
    }): void;
    remove(id: string): void;
    forEach(callback: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcHtmlManager, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AcHtmlManager>;
}
