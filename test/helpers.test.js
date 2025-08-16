import {
  airTempFormatter, toFahrenheit, toCelsius, swapTempUnit, airSpeedFormatter, airDirxnFormatter, timeFormatter, colorForAirQual
} from '../scripts/helpers.js';

describe('Unit Converters', () => {
  it('toFarenheit works', () => {
    expect(toFahrenheit(0)).toBe(32);
    expect(toFahrenheit(100)).toBe(212);
    expect(toFahrenheit(50)).toBe(122);
  });

  it('toCelsius works', () => {
    expect(toCelsius(32)).toBe(0);
    expect(toCelsius(212)).toBe(100);
    expect(toCelsius(122)).toBe(50);
  });
});