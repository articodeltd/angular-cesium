import { instance, mock } from 'ts-mockito';

export function mockProvider(clazz) {
  return {provide: clazz, useValue: instance(mock(clazz))};
}

export function providerFromMock(clazz, mocked) {
  return {provide: clazz, useValue: instance(mocked)};
}

export function provider(clazz, inst) {
  return {provide: clazz, useValue: inst};
}
