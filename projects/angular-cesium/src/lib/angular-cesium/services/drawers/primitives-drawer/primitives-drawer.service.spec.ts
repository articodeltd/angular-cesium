import { inject, TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { PrimitiveCollection, GeometryAttribute } from 'cesium';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { providerFromMock } from '../../../utils/testingUtils';
import { PrimitivesDrawerService } from './primitives-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';

@Injectable()
class SimpleDrawerServiceTestClass extends PrimitivesDrawerService {
  constructor(cesiumService: CesiumService) {
    super(PrimitiveCollection, cesiumService);
  }
}

describe('PrimitivesDrawerService', () => {

  const geometryProps2 = {
    attributes: {
      position: new GeometryAttribute({
        values: new Float64Array([
          0.0, 0.0, 0.0,
          7500000.0, 0.0, 0.0,
          0.0, 7500000.0, 0.0
        ])
      }),
      color: new GeometryAttribute({
        values: [80, 80, 80, 100]
      })
    }
  };

  let geometryProps;
  const cesiumService = mock(CesiumService);
  let primitiveCollection;

  beforeEach(() => {
    geometryProps = {
      attributes: {
        position: new GeometryAttribute({
          values: new Float64Array([
            1.0, 0.0, 0.0,
            8000000.0, 0.0, 0.0,
            0.0, 0.0, 0.0
          ])
        }),
        color: new GeometryAttribute({
          values: [101, 0, 100, 100]
        })
      }
    };

    primitiveCollection = mock(PrimitiveCollection);
    when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

    TestBed.configureTestingModule({
      providers: [SimpleDrawerServiceTestClass, providerFromMock(CesiumService, cesiumService)],
    });
  });

  beforeEach(inject([SimpleDrawerServiceTestClass], (service: SimpleDrawerServiceTestClass) => {
    service.init();
  }));

  it('should create and return a new primitive', inject([SimpleDrawerServiceTestClass], (service: SimpleDrawerServiceTestClass) => {
    const geometryInstance = service.add(geometryProps);

    verify(primitiveCollection.add(anything())).once();
    expect(geometryInstance).toBeDefined();
  }));

  it('should update a given primitive\'s attribute positions',
    inject([SimpleDrawerServiceTestClass], (service: SimpleDrawerServiceTestClass) => {
      const geometryInstance = service.add(geometryProps);
      const oldPositions = geometryInstance.attributes.position.values;
      service.update(geometryInstance, geometryProps2);

      expect(oldPositions).not.toEqual(geometryInstance.attributes.position.values);
    }));

  it('should update a given primitive\'s attribute color',
    inject([SimpleDrawerServiceTestClass], (service: SimpleDrawerServiceTestClass) => {
      const geometryInstance = service.add(geometryProps);
      const oldColor = geometryInstance.attributes.color.values;
      service.update(geometryInstance, geometryProps2);

      expect(oldColor).not.toEqual(geometryInstance.attributes.color.values);
    }));
});



