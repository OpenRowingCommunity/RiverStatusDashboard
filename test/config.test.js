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
  
});
