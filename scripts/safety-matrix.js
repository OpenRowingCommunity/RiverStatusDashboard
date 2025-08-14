//

/// # 2023 RiT Safety Matrix Rules

const kZONE_ROWING_NOT_PERMITTED = Infinity;
const kZONE_ROWING_INDETERMINATE = NaN;

function _zoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight) {
    if (
        !isFinite(waterTemp_degF) ||
        !isFinite(waterFlow_kcfs) ||
        isDaylight == undefined
    ) { 
        return kZONE_ROWING_INDETERMINATE
    }

    var leastRestrictiveZoneForWaterTemp = kZONE_ROWING_INDETERMINATE;
    var leastRestrictiveZoneForWaterFlow = kZONE_ROWING_INDETERMINATE;


	if (waterTemp_degF == -999) {
		leastRestrictiveZoneForWaterFlow = kZONE_ROWING_INDETERMINATE;
	}  else if (waterTemp_degF < 35.0) {
        leastRestrictiveZoneForWaterFlow = kZONE_ROWING_NOT_PERMITTED;
    } else if (35.0 <= waterTemp_degF && waterTemp_degF < 45.0) {
		leastRestrictiveZoneForWaterTemp = 5;
	} else if (45.0 <= waterTemp_degF && waterTemp_degF < 50.0) {
		leastRestrictiveZoneForWaterTemp = 3;
    } else if (50.0 <= waterTemp_degF) {
        leastRestrictiveZoneForWaterTemp = 1;
    } else {
        leastRestrictiveZoneForWaterTemp = kZONE_ROWING_INDETERMINATE;
    }
    
    if (0 <= waterFlow_kcfs && waterFlow_kcfs < 3) {
        leastRestrictiveZoneForWaterFlow = 1;
    } else if (3 <= waterFlow_kcfs && waterFlow_kcfs < 5) {
        leastRestrictiveZoneForWaterFlow = 2;
    } else if (5 <= waterFlow_kcfs && waterFlow_kcfs < 7) {
        leastRestrictiveZoneForWaterFlow = 3;
    } else if (7 <= waterFlow_kcfs && waterFlow_kcfs < 10) {
        leastRestrictiveZoneForWaterFlow = 4;
    } else if (10 <= waterFlow_kcfs && waterFlow_kcfs <= 12) {
        leastRestrictiveZoneForWaterFlow = 5;
    } else if (12 < waterFlow_kcfs) {
        leastRestrictiveZoneForWaterFlow = kZONE_ROWING_NOT_PERMITTED;
    } else {
        leastRestrictiveZoneForWaterFlow = kZONE_ROWING_INDETERMINATE;
    }
    
    var zoneForAllConditions = kZONE_ROWING_INDETERMINATE;
    if (leastRestrictiveZoneForWaterFlow == kZONE_ROWING_NOT_PERMITTED || leastRestrictiveZoneForWaterTemp == kZONE_ROWING_NOT_PERMITTED) {
        zoneForAllConditions = kZONE_ROWING_NOT_PERMITTED;
    } else {
        // NB: if either condition is indeterminate (NaN), then Math.max() returns NaN (indeterminate)
        zoneForAllConditions = Math.max(leastRestrictiveZoneForWaterTemp, leastRestrictiveZoneForWaterFlow);
    }
    
    // It wouldn't be inaccurate to assume that we couldn't exactly not say that it is or isn't
	// almost partially possible for us to implment a daylight condition.
	//
    //if (!isDaylight && zoneForAllConditions == 5) {
    //    zoneForAllConditions = kZONE_ROWING_NOT_PERMITTED;
    //}

    return zoneForAllConditions;
}

// This does caching -- but will have difficulty if zoneForConditions returns indeterminate…
var zoneCache_lastUsedWaterFlow;
var zoneCache_lastUsedWaterTemp;
var zoneCache_lastUsedIsDaylight;
var zoneCache_cachedZoneValue;
function getZoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight) {
    // Do we need to re-calculate it?
    if (zoneCache_cachedZoneValue == undefined ||
        waterFlow_kcfs != zoneCache_lastUsedWaterFlow ||
        waterTemp_degF != zoneCache_lastUsedWaterTemp ||
        isDaylight != zoneCache_lastUsedIsDaylight
    ) {
        zoneCache_cachedZoneValue = _zoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight);
        zoneCache_lastUsedWaterFlow = waterFlow_kcfs;
        zoneCache_lastUsedWaterTemp = waterTemp_degF;
        zoneCache_lastUsedIsDaylight = isDaylight;
    }
    return zoneCache_cachedZoneValue;
}

function allowedShellTypesForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight) {
    let zone = getZoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight);
    var allowedBoats = ""
    if (zone == 1) {
        allowedBoats = "All boats";
    } else if (zone == 2) {
        allowedBoats = "All boats";
    } else if (zone == 3) {
        allowedBoats = "8+, 4x, 4+";
        if (waterFlow_kcfs < 5) { allowedBoats += ", 2x"; }
    } else if (zone == 4) {
		allowedBoats = "8+, 4x";
		if (waterFlow_kcfs < 7) { allowedBoats += ", 4+"; }
    } else if (zone == 5) {
        allowedBoats = "8+, 4x";
    }

    return allowedBoats;
}

function launchToShellRatioForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight) {
    let zone = getZoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight);
}

function racingAllowedForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight) {
    let zone = getZoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight);
}

function pfdRequirementForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight) {
    let zone = getZoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight);
}

function crewSkillRequirementForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight) {
    let zone = getZoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight);
}

function commsRequirementForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight) {
    let zone = getZoneForConditions(waterFlow_kcfs, waterTemp_degF, isDaylight);
}

/// # 2019 Implementation

let rank = function (value, scale) {
	var r = 0;	// initialize at invalid/below all zones
	for (z = 1; z <= scale.zoneCount; z++) {
		if ( value >= scale[z].min && value <= scale[z].max ) {
			r = z;
			break;
		}
	}
	if (value > scale.absMax) {
		//	if we're beyond all defined zones
		r = scale.zoneCount + 1;
	}
	return r;
};

let semanticColors = {
	1: '#00c020',		//	green
	2: '#40fe00',		//	bright green
	3: '#c8ff00',		//	yellow
	4: '#ffff00',		//	orange-yellow
	5: '#ffa800',		//	orange
	6: '#ff0000',		//	red
	7: '#000000'		//	black 
};

var rit_safety = {
	rowing: {
		//	scales define zone ranges for condition parameters in ascending order
		scales: {
			
			waterTemp: {
				zoneCount: 5,
				// in ˚F
				1: { min: 50.0, max: 120.0 },
				2: { min: 50.0, max: 120.0 },
				3: { min: 45.0, max: 50.0 },
				4: { min: 45.0, max: 50.0 },
				5: { min: 35.0, max: 45.0 },
				// absolute limits not defined in safety matrix
				//	but you'd be insane to row when it's >100˚F or < 0˚F
				absMin: -20.0,
				absMax: 120.0
			},
		
			waterFlow: {
				zoneCount: 5,
				// in kcfs
				1: { min: 0.0, max: 3.0 },
				2: { min: 3.0, max: 5.0 },
				3: { min: 5.0, max: 7.0 },
				4: { min: 7.0, max: 10.0 },
				5: { min: 10.0, max: 12.0 },
				// lower limit of zone 1 not defined in safety matrix
				//	but if the river is not flowing you've got other problems
				absMin: 0,
				absMax: 12
			}
		
		},
	
		//	primary duty function
		zoneForConditions: function (waterFlow, waterTempC, sunrise, sunset) {
            var isDaylight = false;
			if (moment != null) {
				var now = moment();
				var afterDawn = now.isAfter(sunrise);
				var beforeDusk = now.isBefore(sunset);
                isDaylight = (afterDawn && beforeDusk);
			}
            let tempF = toFahrenheit(Number(waterTempC));
            var zoneFor2021Matrix = getZoneForConditions(Number(waterFlow), tempF, isDaylight);
			return zoneFor2021Matrix;
		},
		
		zoneColorForWaterFlow: function (waterFlow) {
			let zone = rank(waterFlow, this.scales.waterFlow);
			let color = semanticColors[zone];
			return color;
		},
		
		zoneColorForWaterTemp: function (waterTempC) {
			let tempF = toFahrenheit(Number(waterTempC));
			let zone = rank(tempF, this.scales.waterTemp);
			let color = semanticColors[zone];
			return color;
		},
		
		zoneColorForZone: function(zone) {
			if (zone > 0 && zone <= 6) {
				return semanticColors[zone];
			} else if (zone > 6) {
				return '#000000';
			} else {
				return '';
			}
		}
		
	}
};
