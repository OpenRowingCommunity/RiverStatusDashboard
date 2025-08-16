import { test } from 'vitest';
import {
  SafetyMatrix, SafetyZone, SafetyZoneRestriction, RiverStatusConfig
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


});


