import { inject, TestBed } from '@angular/core/testing';
import { Math as cMath, PrimitiveCollection, Cartesian3, Color, ColorGeometryInstanceAttribute, PerInstanceColorAppearance } from 'cesium';
import { StaticEllipseDrawerService } from './ellipse-drawer.service';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { CesiumService } from '../../../cesium/cesium.service';
import { providerFromMock } from '../../../../utils/testingUtils';

describe('EllipseStaticDrawerService', () => {
  const geometryProps: any = {
    center: Cartesian3.fromRadians(Math.random(), Math.random()),
    semiMajorAxis: 500000.0,
    semiMinorAxis: 300000.0,
    height: 15000.0,
    rotation: cMath.toRadians(45)
  };

  let instanceProps;
  let primitiveProps;

  const otherGeometryProps = {
    center: Cartesian3.fromRadians(Math.random(), Math.random()),
    semiMajorAxis: 900000.0,
    semiMinorAxis: 1000000.0,
    height: 9000.0,
    rotation: cMath.toRadians(20)
  };

  const cesiumService = mock(CesiumService);
  let primitiveCollection;

  beforeEach(() => {
    instanceProps = {
      color: ColorGeometryInstanceAttribute.fromColor(Color.fromRandom())
    };
    primitiveProps = new PerInstanceColorAppearance({
      translucent: false,
      closed: true
    });
    primitiveCollection = mock(PrimitiveCollection);
    when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticEllipseDrawerService, providerFromMock(CesiumService, cesiumService)]
    });
  });


  beforeEach(inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    service.init();
  }));

  it('should create and return a new ellipse primitive.', inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);

    verify(primitiveCollection.add(anything())).once();
    expect(ellipsePrimitive).toBeDefined();
  }));

  it('should not update a given ellipse\'s semi axises', inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);
    const oldAxis = ellipsePrimitive.semiMajorAxis;

    service.update(ellipsePrimitive, otherGeometryProps, instanceProps, primitiveProps);

    expect(oldAxis).toEqual(ellipsePrimitive.semiMajorAxis);
  }));

  it('should not update given ellipse\'s height', inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);
    const oldHeight = ellipsePrimitive.height;

    service.update(ellipsePrimitive, otherGeometryProps, instanceProps, primitiveProps);

    expect(oldHeight).toEqual(ellipsePrimitive.height);
  }));

  it('should not update given ellipse\'s rotation', inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);
    const oldRotation = ellipsePrimitive.rotation;

    service.update(ellipsePrimitive, otherGeometryProps, instanceProps, primitiveProps);

    expect(oldRotation).toEqual(ellipsePrimitive.rotation);
  }));

  it('should not update given ellipse\'s center', inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);
    const oldCenter = ellipsePrimitive.center;

    service.update(ellipsePrimitive, otherGeometryProps, instanceProps, primitiveProps);

    expect(oldCenter).toEqual(ellipsePrimitive.center);
  }));

  it('should throw if instance props are not given', inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    instanceProps = undefined;

    expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
  }));

  it('should NOT throw if primitive props are empty', inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    primitiveProps = {};

    expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toBeDefined();
  }));

  it('should throw if primitive props are not given', inject([StaticEllipseDrawerService], (service: StaticEllipseDrawerService) => {
    primitiveProps = undefined;

    expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
  }));
});
