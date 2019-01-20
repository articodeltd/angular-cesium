import { inject, TestBed } from '@angular/core/testing';
import { PrimitivePolygonDrawerService } from './primitive-polygon-drawer.service';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { CesiumService } from '../../cesium/cesium.service';
import { providerFromMock } from '../../../utils/testingUtils';

describe('PrimitivePolygonDrawerService', () => {
  let geometryProps: any = {
    height: 15000.0,
    polygonHierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray([
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random()
      ])
    )
  };

  let instanceProps: any = {
    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
  };
  let primitiveProps: any = new Cesium.PerInstanceColorAppearance({
    translucent: false,
    closed: true
  });

  const otherGeometryProps = {
    height: 13000.0,
    polygonHierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray([
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random()
      ])
    )
  };

  const cesiumService = mock(CesiumService);
  const primitiveCollection: any = mock(Cesium.PrimitiveCollection);

  when(cesiumService.getScene()).thenReturn({ primitives: instance(primitiveCollection) });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrimitivePolygonDrawerService, providerFromMock(CesiumService, cesiumService)]
    });
  });

  beforeEach(inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
    service.init();
  }));

  it('should create and return a new polygon primitive.',
    inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
      const polygonPrimitive = service.add(geometryProps, instanceProps, primitiveProps);

      verify(primitiveCollection.add(anything())).once();
      expect(polygonPrimitive).toBeDefined();
    }));

  it('should not update a given polygon\'s height', inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
    const polygonPrimitive = service.add(geometryProps, instanceProps, primitiveProps);
    const oldPositions = polygonPrimitive.height;

    service.update(polygonPrimitive, otherGeometryProps, instanceProps, primitiveProps);

    expect(oldPositions).toEqual(polygonPrimitive.height);
  }));

  it('should not update given polygon\'s polygon hierarchy',
    inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
      const polygonPrimitive = service.add(geometryProps, instanceProps, primitiveProps);
      const oldWidth = polygonPrimitive.polygonHierarchy;

      service.update(polygonPrimitive, otherGeometryProps, instanceProps, primitiveProps);

      expect(oldWidth).toEqual(polygonPrimitive.polygonHierarchy);
    }));

  it('should throw if geometry props are not given', inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
    geometryProps = undefined;

    expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
  }));

  it('should throw if instance props are empty', inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
    instanceProps = {};

    expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
  }));

  it('should throw if instance props are not given', inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
    instanceProps = undefined;

    expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
  }));

  it('should NOT throw if primitive props are empty', inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
    primitiveProps = {};

    expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toBeDefined();
  }));

  it('should throw if primitive props are not given', inject([PrimitivePolygonDrawerService], (service: PrimitivePolygonDrawerService) => {
    primitiveProps = undefined;

    expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
  }));
});
