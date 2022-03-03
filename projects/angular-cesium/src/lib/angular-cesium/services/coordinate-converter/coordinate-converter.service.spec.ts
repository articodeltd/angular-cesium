import { inject, TestBed } from '@angular/core/testing';
import { Camera, Cartesian3 } from 'cesium';
import { instance, mock, when } from 'ts-mockito';
import { providerFromMock } from '../../utils/testingUtils';
import { CoordinateConverter } from './coordinate-converter.service';
import { CesiumService } from '../cesium/cesium.service';

describe('CoordinateConverter', () => {
  const cesiumService = mock(CesiumService);
  const cesiumCamera = mock(Camera);

  when(cesiumService.getViewer()).thenReturn({ camera: instance(cesiumCamera) } as any);

  describe('Exception', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [CoordinateConverter]
      });
    });

    it('should throw when CesiumService was not passed', inject([CoordinateConverter], (service: CoordinateConverter) => {
      let testPassed = false;
      try {
        service.screenToCartesian3({ x: 10, y: 20 });
      } catch (e) {
        testPassed = true;
      }

      expect(testPassed).toBeTruthy();
    }));
  });

  describe('Covert test:', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [CoordinateConverter, providerFromMock(CesiumService, cesiumService)]
      });
    });

    describe('Screen -> Cartesian3', () => {
      it('should convert.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartesian3 = service.screenToCartesian3({ x: 10, y: 20 });

        expect(cartesian3).toBeDefined();
      }));
    });

    describe('Screen -> Cartographic', () => {
      it('should convert.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        expect('Transitive test').toBeDefined();
      }));
    });

    describe('Cartesian3 -> Cartographic', () => {
      it('should convert.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.cartesian3ToCartographic(new Cartesian3(10, 20, 30));

        expect(cartographic).toBeDefined();
      }));

      it('should consist of Cartographic interface.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.cartesian3ToCartographic(new Cartesian3(10, 20, 30));

        expect(cartographic.longitude).toBeDefined();
        expect(cartographic.latitude).toBeDefined();
        expect(cartographic.height).toBeDefined();
      }));
    });

    describe('Degrees -> Cartographic', () => {
      it('should convert.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.degreesToCartographic(10, 20, 30);

        expect(cartographic).toBeDefined();
      }));

      it('should consist of Cartographic interface.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.degreesToCartographic(10, 20, 30);

        expect(cartographic.longitude).toBeDefined();
        expect(cartographic.latitude).toBeDefined();
        expect(cartographic.height).toBeDefined();
      }));

      it('should convert when no height provided.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.degreesToCartographic(10, 20);

        expect(cartographic).toBeDefined();
        expect(cartographic.longitude).toBeDefined();
        expect(cartographic.latitude).toBeDefined();
        expect(cartographic.height).toEqual(0);
      }));

      it('should convert by degree to radian calculation', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.degreesToCartographic(10, 20, 30);

        expect((cartographic.longitude / Math.PI) * (180)).toEqual(10);
        expect((cartographic.latitude / Math.PI) * (180)).toEqual(20);
        expect(cartographic.height).toEqual(30);
      }));
    });

    describe('Radians -> Cartographic', () => {
      it('should convert.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.radiansToCartographic(10, 20, 30);

        expect(cartographic).toBeDefined();
      }));

      it('should consist of Cartographic interface.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.radiansToCartographic(10, 20, 30);

        expect(cartographic.longitude).toBeDefined();
        expect(cartographic.latitude).toBeDefined();
        expect(cartographic.height).toBeDefined();
      }));

      it('should convert when no height provided.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.radiansToCartographic(10, 20);

        expect(cartographic).toBeDefined();
        expect(cartographic.longitude).toBeDefined();
        expect(cartographic.latitude).toBeDefined();
        expect(cartographic.height).toEqual(0);
      }));

      it('should convert but be different from degrees (except for height)',
        inject([CoordinateConverter], (service: CoordinateConverter) => {
          const latLongHeightObject = { long: 10, lat: 20, height: 30 };
          const cartographicFromDegrees = service.degreesToCartographic(latLongHeightObject.long,
            latLongHeightObject.lat, latLongHeightObject.height);
          const cartographicFromRadians = service.radiansToCartographic(latLongHeightObject.long,
            latLongHeightObject.lat, latLongHeightObject.height);

          expect(cartographicFromDegrees.longitude === cartographicFromRadians.longitude).toBeFalsy();
          expect(cartographicFromDegrees.latitude === cartographicFromRadians.latitude).toBeFalsy();
          expect(cartographicFromDegrees.height).toEqual(cartographicFromRadians.height);
        }));

      it('should convert and be equal to the sent parameters', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const latLongHeightObject = { long: 10, lat: 20, height: 30 };
        const cartographicFromRadians = service.radiansToCartographic(latLongHeightObject.long,
          latLongHeightObject.lat, latLongHeightObject.height);

        expect(cartographicFromRadians.longitude).toEqual(10);
        expect(cartographicFromRadians.latitude).toEqual(20);
        expect(cartographicFromRadians.height).toEqual(30);
      }));
    });

    describe('Degrees -> UTM', () => {
      it('should convert.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const utmData = service.degreesToUTM(10, 20);

        expect(utmData).toBeDefined();
      }));

      it('should consist of UTM interface.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const utmData = service.degreesToUTM(10, 20);

        expect(utmData.zone).toBeDefined();
        expect(utmData.hemisphere).toBeDefined();
        expect(utmData.easting).toBeDefined();
        expect(utmData.northing).toBeDefined();
      }));
    });

    describe('UTM -> Degrees', () => {
      it('should convert.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.UTMToDegrees(10, 'N', 20, 30);

        expect(cartographic).toBeDefined();
      }));

      it('should consist of Degrees interface.', inject([CoordinateConverter], (service: CoordinateConverter) => {
        const cartographic = service.UTMToDegrees(10, 'N', 20, 30);

        expect(cartographic.longitude).toBeDefined();
        expect(cartographic.latitude).toBeDefined();
        expect(cartographic.height).toBeDefined();
      }));
    });
  });
});
