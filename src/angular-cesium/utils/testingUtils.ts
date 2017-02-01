import { instance, mock } from 'ts-mockito';

export function mockProvider(clazz){
    return {provide: clazz, useValue: instance(mock(clazz))};
}

export function providerFromMock(clazz, mock){
    return {provide: clazz, useValue: instance(mock)};
}

export function provider(clazz, instance){
    return {provide: clazz, useValue: instance};
}