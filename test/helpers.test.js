import {
  toFahrenheit, toCelsius, swapTempUnit, toMPH, validateNumber
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

  it('toMPH works', () => {
    expect(toMPH(1)).toBe(2.236936);
    expect(toMPH(1000)).toBe(2236.936);
    expect(toMPH(5.32)).toBe(11.9005);
  });

  
});


describe('Small Helpers', () => {
  it('Swapping temperature unit works', () => {
    expect(swapTempUnit("degrees F")).toBe("degrees C");
    expect(swapTempUnit("degrees C")).toBe("degrees F");
    expect(swapTempUnit("˚C")).toBe("˚F");

  });
});


describe("validate Number", () => {
  it('Can correctly validate numbers', () => {
    expect(validateNumber(1)).toBe(true);
    expect(validateNumber("32")).toBe(true);
    expect(validateNumber("3 56")).toBe(false);
    expect(validateNumber("abc")).toBe(false);
    expect(validateNumber("")).toBe(false);
    expect(validateNumber(undefined)).toBe(false);


  });
})