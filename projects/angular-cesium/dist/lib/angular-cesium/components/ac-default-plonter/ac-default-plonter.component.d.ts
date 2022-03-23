import { ChangeDetectorRef, OnInit } from '@angular/core';
import { PlonterService } from '../../services/plonter/plonter.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
import * as i0 from "@angular/core";
export declare class AcDefaultPlonterComponent implements OnInit {
    plonterService: PlonterService;
    private cd;
    private geoConverter;
    constructor(plonterService: PlonterService, cd: ChangeDetectorRef, geoConverter: CoordinateConverter);
    ngOnInit(): void;
    get plonterPosition(): any;
    chooseEntity(entity: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcDefaultPlonterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcDefaultPlonterComponent, "ac-default-plonter", never, {}, {}, never, never>;
}
