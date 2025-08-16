import { test } from 'vitest';
import {
  SafetyMatrix, SafetyZone, SafetyZoneRestriction, RiverStatusConfig, Condition
} from '../scripts/config.js';
import { DatapointIdentifier } from '../scripts/constants.js';

describe('SafetyZone', () => {
  it('isTriggeredBy', () => {

	var sut = new SafetyZone({
		text: "a",
		color: "#fff",
		conditions: {
			[DatapointIdentifier.AIR_QUALITY]: 50
		},
		restrictions: []
  	})

	let dataUnder = {
		[DatapointIdentifier.AIR_QUALITY]: 42
	}

	let dataAt = {
		[DatapointIdentifier.AIR_QUALITY]: 50
	}

	let dataOver = {
		[DatapointIdentifier.AIR_QUALITY]: 300
	}

    expect(sut.isTriggeredBy(dataUnder)).toBe(false);
	expect(sut.isTriggeredBy(dataAt)).toBe(true);
	expect(sut.isTriggeredBy(dataOver)).toBe(true);
  });

  it('equals', () => {
    expect(SafetyZone.UNKNOWN).toEqual(SafetyZone.UNKNOWN);
  });

});

describe('SafetyMatrix', () => {
  it('getZoneForData happy paths', () => {

	var sz = new SafetyZone({
		text: "a",
		color: "#fff",
		conditions: {
			[DatapointIdentifier.AIR_QUALITY]: 50
		},
		restrictions: []
  	})

	var sut = new SafetyMatrix({
		safetyZones: [
			sz
		],
		unsafeZone: undefined
	})

	let dataUnder = {
		[DatapointIdentifier.AIR_QUALITY]: 42
	}

	let dataAt = {
		[DatapointIdentifier.AIR_QUALITY]: 50
	}

	let dataOver = {
		[DatapointIdentifier.AIR_QUALITY]: 300
	}

    expect(sut.getZoneForData(dataUnder)).toBe(SafetyZone.UNKNOWN);
	expect(sut.getZoneForData(dataAt)).toEqual(sz);
	expect(sut.getZoneForData(dataOver)).toEqual(sz);
  });

  it('getZoneForData oddball paths', () => {
	var sutEmpty = new SafetyMatrix({
		safetyZones: [],
		unsafeZone: undefined
	})

	var sutUndef = new SafetyMatrix({
		safetyZones: undefined,
		unsafeZone: undefined
	})

	let dataAt = {
		[DatapointIdentifier.AIR_QUALITY]: 50
	}

    expect(sutEmpty.getZoneForData(dataAt)).toBe(SafetyZone.UNKNOWN);
    expect(sutUndef.getZoneForData(dataAt)).toBe(SafetyZone.UNKNOWN);
  });

  it('getZoneForData multiple data points', () => {

	var sz1 = new SafetyZone({
		text: "a",
		color: "#fff",
		conditions: {
			[DatapointIdentifier.AIR_QUALITY]: 50,
			[DatapointIdentifier.AIR_TEMP]: 42
		},
		restrictions: []
  	})
	var sz2 = new SafetyZone({
		text: "a",
		color: "#fff",
		conditions: {
			[DatapointIdentifier.AIR_QUALITY]: 80,
			[DatapointIdentifier.AIR_TEMP]: 60
		},
		restrictions: []
  	})
	var sz3 = new SafetyZone({
		text: "a",
		color: "#fff",
		conditions: {
			[DatapointIdentifier.AIR_QUALITY]: 100,
			[DatapointIdentifier.AIR_TEMP]: 80
		},
		restrictions: []
  	})

	var sut = new SafetyMatrix({
		safetyZones: [
			sz1,
			sz2
		],
		unsafeZone: sz3
	})

	let dataUnder = {
		[DatapointIdentifier.AIR_QUALITY]: 42,
		[DatapointIdentifier.AIR_TEMP]: 30
	}

	let dataOneAt = {
		[DatapointIdentifier.AIR_QUALITY]: 50,
		[DatapointIdentifier.AIR_TEMP]: 42
	}

	let dataOneOver = {
		[DatapointIdentifier.AIR_QUALITY]: 300,
		[DatapointIdentifier.AIR_TEMP]: 60
	}

	let dataSplit = {
		[DatapointIdentifier.AIR_QUALITY]: 60,
		[DatapointIdentifier.AIR_TEMP]: 70
	}

	let oneDataPoint = {
		[DatapointIdentifier.AIR_QUALITY]: 60,
	}

	let extraDataPoint = {
		[DatapointIdentifier.AIR_SPEED]: 60,
	}

    expect(sut.getZoneForData(dataUnder)).toEqual(SafetyZone.UNKNOWN);
	expect(sut.getZoneForData(dataOneAt)).toEqual(sz1);
	expect(sut.getZoneForData(dataOneOver)).toEqual(sz3);
	expect(sut.getZoneForData(dataSplit)).toEqual(sz2);
	expect(sut.getZoneForData(oneDataPoint)).toEqual(sz1);
	expect(sut.getZoneForData(extraDataPoint)).toEqual(SafetyZone.UNKNOWN);
	expect(sut.getZoneForData({})).toEqual(SafetyZone.UNKNOWN);
  });


});

describe('Condition Constructor', () => {

  // Test Case 1: Both min and max provided (normal bounded case)
  test('should correctly set lowerBound and upperBound when both min and max are valid numbers', () => {
    // Case 1.1: min < max
    const condition1 = new Condition('temp', { min: 10, max: 20, unit: 'C' });
    expect(condition1.datapointId).toBe('temp');
    expect(condition1.unit).toBe('C');
    expect(condition1.lowerBound).toBe(10);
    expect(condition1.upperBound).toBe(20);

    // Case 1.2: min > max (should swap them)
    const condition2 = new Condition('wind', { min: 20, max: 10, unit: 'mph' });
    expect(condition2.datapointId).toBe('wind');
    expect(condition2.unit).toBe('mph');
    expect(condition2.lowerBound).toBe(10);
    expect(condition2.upperBound).toBe(20);

    // Case 1.3: min == max (should set both to the same value, creating an exact point)
    const condition3 = new Condition('pressure', { min: 50, max: 50, unit: 'psi' });
    expect(condition3.datapointId).toBe('pressure');
    expect(condition3.unit).toBe('psi');
    expect(condition3.lowerBound).toBe(50);
    expect(condition3.upperBound).toBe(50);
  });

  // Test Case 2: Only min is provided (at least case)
  test('should set only lowerBound when only min is provided', () => {
    const condition1 = new Condition('depth', { min: 5, unit: 'ft' });
    expect(condition1.datapointId).toBe('depth');
    expect(condition1.unit).toBe('ft');
    expect(condition1.lowerBound).toBe(5);
    expect(condition1.upperBound).toBeUndefined(); // Should be undefined as there's no max

    // Test with max as null/undefined explicitly
    const condition2 = new Condition('depth', { min: 5, max: undefined, unit: 'ft' });
    expect(condition2.lowerBound).toBe(5);
    expect(condition2.upperBound).toBeUndefined();
  });

  // Test Case 3: Only max is provided (less than case)
  test('should set only upperBound when only max is provided', () => {
    const condition1 = new Condition('visibility', { max: 10, unit: 'm' });
    expect(condition1.datapointId).toBe('visibility');
    expect(condition1.unit).toBe('m');
    expect(condition1.lowerBound).toBeUndefined(); // Should be undefined as there's no min
    expect(condition1.upperBound).toBe(10);

    // Test with min as null/undefined explicitly
    const condition2 = new Condition('visibility', { min: undefined, max: 10, unit: 'm' });
    expect(condition2.lowerBound).toBeUndefined();
    expect(condition2.upperBound).toBe(10);
  });

  // Test Case 4: No min or max provided (error case)
  test('should throw an error if neither min nor max are valid numbers', () => {
    // Case 4.1: Both undefined
    expect(() => new Condition('flow', {})).toThrow("Condition with no values cannot be evaluated");
    // Case 4.2: Both null
    expect(() => new Condition('flow', { min: null, max: null })).toThrow("Condition with no values cannot be evaluated");
    // Case 4.3: Both invalid strings
    expect(() => new Condition('flow', { min: 'abc', max: 'xyz' })).toThrow("Condition with no values cannot be evaluated");
    // Case 4.4: One invalid string, one undefined/null
    expect(() => new Condition('flow', { min: 'abc' })).toThrow("Condition with no values cannot be evaluated");
    expect(() => new Condition('flow', { max: 'xyz' })).toThrow("Condition with no values cannot be evaluated");
  });

  // Test Case 5: Handling of non-numeric inputs (validateNumber handles this)
  test('should correctly handle non-numeric but convertible string inputs', () => {
    // Both strings
    const condition1 = new Condition('value', { min: '10', max: '20', unit: '' });
    expect(condition1.lowerBound).toBe(10);
    expect(condition1.upperBound).toBe(20);

    // One string
    const condition2 = new Condition('value', { min: '5', unit: '' });
    expect(condition2.lowerBound).toBe(5);
    expect(condition2.upperBound).toBeUndefined();

    const condition3 = new Condition('value', { max: '15', unit: '' });
    expect(condition3.lowerBound).toBeUndefined();
    expect(condition3.upperBound).toBe(15);
  });

  // Test Case 6: DatapointId and Unit
  test('should correctly store datapointId and unit', () => {
    const condition = new Condition('pressure', { min: 100, max: 200, unit: 'kPa' });
    expect(condition.datapointId).toBe('pressure');
    expect(condition.unit).toBe('kPa');
  });
});


