import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ColorGeometryInstanceAttribute, Color, Cartesian3, PolylineColorAppearance, PrimitiveCollection } from 'cesium';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { StaticPolylineDrawerService } from './static-polyline-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';
import { providerFromMock } from '../../../../utils/testingUtils';

describe('StaticPolylineDrawerService', () => {

  let staticPolylineAttribute;
  let staticPolylineProps;

  const cesiumService = mock(CesiumService);
  let primitiveCollection;

  beforeEach(() => {
    staticPolylineAttribute = {
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(Color.fromRandom())
      }
    };

    staticPolylineProps = {
      geometry: {
        width: 1,
        positions: Cartesian3.fromDegreesArray(
          [
            Math.floor(Math.random() * 50), Math.floor(Math.random() * 50),
            Math.floor(Math.random() * 50), Math.floor(Math.random() * 50)
          ]),
      },
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(Color.fromRandom())
      },
      appearance: new PolylineColorAppearance({
        translucent: false
      }),
      ready: null,
      readyPromise: null,
      getGeometryInstanceAttributes: () => {
        return {color: null};
      }
    };

    primitiveCollection = mock(PrimitiveCollection);
    when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

    TestBed.configureTestingModule({
      providers: [StaticPolylineDrawerService, providerFromMock(CesiumService, cesiumService)],
    });
  });

  beforeEach(inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
    service.init();
  }));

  it('should create and return a new static polyline primitive.',
    inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
      const staticPolyline = service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance);

      verify(primitiveCollection.add(anything())).once();
      expect(staticPolyline).toBeDefined();
    }));

  it('should update a given static polyline\'s color',
    fakeAsync(inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
      staticPolylineProps.ready = true;
      const spy = spyOn(staticPolylineProps, 'getGeometryInstanceAttributes').and.returnValue({color: null});
      service.update(staticPolylineProps, null, staticPolylineAttribute, null);
      expect(staticPolylineProps.getGeometryInstanceAttributes).toHaveBeenCalled();

      spy.calls.reset();
      staticPolylineProps.ready = null;
      staticPolylineProps.readyPromise = Promise.resolve(staticPolylineProps);
      service.update(staticPolylineProps, null, staticPolylineAttribute, null);
      tick();
      expect(staticPolylineProps.getGeometryInstanceAttributes).toHaveBeenCalled();
    })));

  it('should throw if positions is not given', inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
    staticPolylineProps.geometry.positions = undefined;

    expect(() => service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance)).toThrow();
  }));

  it('should throw if appearance is not given', inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
    staticPolylineProps.appearance = undefined;

    expect(() => service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance)).toThrow();
  }));
});

