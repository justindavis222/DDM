// App.test.ts
import {customCalculate} from '../App';

const hashCombinationModel = {name: 'Hash Combination'};
const statisticsModel = {name: 'Statistics'};

describe('customCalculate', () => {
  it('calculates the hash for the Hash Combination model', () => {
    const fields = {
      string1: {value: 'abc', type: 'string', readonly: false, calculate: null},
      string2: {value: 'def', type: 'string', readonly: false, calculate: null},
    };
    const result = customCalculate('hash', fields as any, hashCombinationModel);
    expect(result).toEqual(
      '516a5e926ce20c5f4d80f00e1a01abdf14986def6588d6abeed9fce090bc660c',
    );
  });

  it('calculates the median for the Statistics model', () => {
    const fields = {
      a: {readonly: false, value: '1', type: 'float', calculate: null},
      b: {readonly: false, value: '2', type: 'float', calculate: null},
      c: {readonly: false, value: '3', type: 'float', calculate: null},
      d: {readonly: false, value: '4', type: 'float', calculate: null},
      e: {readonly: false, value: '5', type: 'float', calculate: null},
      f: {readonly: false, value: '6', type: 'float', calculate: null},
      g: {readonly: false, value: '7', type: 'float', calculate: null},
      h: {readonly: false, value: '8', type: 'float', calculate: null},
      i: {readonly: false, value: '9', type: 'float', calculate: null},
      j: {readonly: false, value: '10', type: 'float', calculate: null},
      mean: {readonly: true, type: 'float', calculate: null},
      median: {readonly: true, type: 'float', calculate: null},
      std_deviation: {readonly: true, type: 'float', calculate: null},
    };
    const result = customCalculate('median', fields as any, statisticsModel);
    expect(result).toEqual('5.50');
  });
});
