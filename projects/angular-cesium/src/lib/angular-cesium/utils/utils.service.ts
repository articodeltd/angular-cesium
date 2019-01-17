export const UtilsService = {
  unique: (array: any[]): any[] => {
    return array.reduce((accumulator, currentValue) => {
      if (accumulator.indexOf(currentValue) < 0) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
  }
};

