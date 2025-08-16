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

    expect(sut.getZoneForData(dataUnder)).toEqual(SafetyZone.UNKNOWN);
	expect(sut.getZoneForData(dataOneAt)).toEqual(sz1);
	expect(sut.getZoneForData(dataOneOver)).toEqual(sz3);
	expect(sut.getZoneForData(dataSplit)).toEqual(sz2);

  });


});


