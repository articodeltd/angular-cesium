import { Checker } from './checker';

describe('Checker', () => {

  describe('method: Present', () => {
    it('Should return false in undefined', () => {
      expect(Checker.present(undefined)).toBeFalsy();
    });

    it('Should return false in null', () => {
      expect(Checker.present(null)).toBeFalsy();
    });
  });

  describe('method: throwIfNotPresent', () => {
    it('Should throw if empty object', () => {
      expect(() => Checker.throwIfNotPresent({}, 'name')).toThrow();
    });

    it('Should throw if not present', () => {
      expect(() => Checker.throwIfNotPresent({'age': 23}, 'name')).toThrow();
    });

    it('Should not throw if present', () => {
      expect(() => Checker.throwIfNotPresent({'name': 'david'}, 'name')).not.toThrow();
    });
  });

  describe('method: throwIfAnyNotPresent', () => {
    it('Should throw if empty object', () => {
      expect(() => Checker.throwIfAnyNotPresent({}, ['name'])).toThrow();
    });

    it('Should throw if not present', () => {
      expect(() => Checker.throwIfAnyNotPresent({'age': 23}, ['name'])).toThrow();
    });

    it('Should not throw if present', () => {
      expect(() => Checker.throwIfAnyNotPresent({'name': 'david'}, ['name'])).not.toThrow();
    });

    it('Should not throw if empty names', () => {
      expect(() => Checker.throwIfAnyNotPresent({'name': 'david'}, [])).not.toThrow();
    });
  });
});
