import { inject, TestBed } from '@angular/core/testing';
import { PolygonHierarchy, Cartesian3, ColorGeometryInstanceAttribute, PerInstanceColorAppearance, Color, PrimitiveCollection } from 'cesium';
import { PrimitivePolygonDrawerService } from './primitive-polygon-drawer.service';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { CesiumService } from '../../cesium/cesium.service';
import { providerFromMock } from '../../../utils/testingUtils';

describe('PrimitivePolygonDrawerService', () => {
  let geometryProps;
  let instanceProps;
  let primitiveProps;

  const otherGeometryProps = {
    height: 13000.0,
    polygonHierarchy: new PolygonHierarchy(
      Cartesian3.fromDegreesArray([
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random(),
        30 * Math.random(), 30 * Math.random()
      ])
    )
  };

  const cesiumService = mock(CesiumService);
  let primitiveCollection;

  beforeEach(() => {
    geometryProps = {
      height: 15000.0,
      polygonHierarchy: new PolygonHierarchy(
        Cartesian3.fromDegreesArray([
          30 * Math.random(), 30 * Math.random(),
          30 * Math.random(), 30 * Math.random(),
          30 * Math.random(), 30 * Math.random(),
          30 * Math.random(), 30 * Math.random(),
          30 * Math.random(), 30 * Math.random()
        ])
      )
    };
    instanceProps = {
      color: ColorGeometryInstanceAttribute.fromColor(Color.fromRandom())
    };
    primitiveProps = new PerInstanceColorAppearance({
      translucent: false,
      closed: true
    });
    primitiveCollection = mock(PrimitiveCollection);
    when(cesiumService.getScene()).thenReturn({ primitives: instance(primitiveCollection) });
  });

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
