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

var trra_safety = {
	rowing: {
		//	scales define zone ranges for condition parameters in ascending order
		scales: {
			
			waterTemp: {
				zoneCount: 4,
				// in ˚C
				1: { min: 10.0, max: 50.0 },
				2: { min: 10.0, max: 50.0 },		// repeating 1 b/c it will break rank() o/w
				3: { min: 4.5, max: 10.0 },
				4: { min: -20.0, max: 4.5},
				// absolute limits not defined in safety matrix
				//	but you'd be insane to row when it's >100˚F or < 0˚F
				absMin: -20.0,
				absMax: 50.0
			},
		
			waterFlow: {
				zoneCount: 6,
				// in kcfs
				1: { min: 0, max: 28 },
				2: { min: 28, max: 35 },
				3: { min: 35, max: 40 },
				4: { min: 40, max: 45 },
				5: { min: 45, max: 50 },
				6: { min: 50, max: 60 },
				// lower limit of zone 1 not defined in safety matrix
				//	but if the river is not flowing you've got other problems
				absMin: 0,
				absMax: 60
			}
		
		},
	
		//	static data from safety matrix
		matrix: {
			
			version: "2016: Revised February 2015 by TRRA Safety Committee and accepted by TRRA Board",
		
			shellType: {
				1: "All boats",
				2: "All boats. For 1x, 2x and 2- without a launch, must have one year rowing experience at TRRA",
				3: "8+, 4+, 4x and 2x, Adaptive LTA racing 2x only",
				4: "8+, 4+ and 4x",
				5: "8+ and 4x",
				6: "8+ and 4x",
				7: "No boats allowed on the water"
			},
		
			launchToShellRatio: {
				1: "Not a requirement",
				2: "Not a requirement",
				3: "1 launch per 2 shells (of equal speed)",
				4: "1 launch per 2 shells (of equal speed)",
				5: "1 launch per shell",
				6: "Sufficient launches to (a) carry all rowers and coxes participating in session, and (b) have at least 2 engines as between all launches on the water (towing line required)",
				7: "I said no boats"
			},
		
			coachCertification: {
				1: "No certification level required",
				2: "No certification level required",
				3: "USRA Level 2+ certification",
				4: "USRA Level 2+ certification",
				5: "USRA Level 2+ certification",
				6: "USRA Level 2+ certification",
				7: "Leave them alone, you can't go out"
			},
		
			pfdRequirement: {
				1: "PFDs Optional",
				2: "PFDs Optional",
				3: "PFDs Optional",
				4: "PFDs on all rowers & coxswains",
				5: "PFDs on all rowers & coxswains",
				6: "PFDs on all rowers & coxswains",
				7: "Don't need any to stay on land"
			},
		
			commRequirement: {
				1: "Protected Cell Phone Recommended",
				2: "Protected Cell Phone Required",
				3: "Protected Cell Phone Required",
				4: "Protected Cell Phone Required",
				5: "Protected Cell Phone Required",
				6: "Protected Cell Phone and Marine Radio Required for all coaches; at least one additional person at the boathouse with cell phone, marine radio and car during entire session",
				7: ""
			},
		
			crewSkillLevel: {
				1: "Any Level",
				2: "Any Level; blind boats as specified above",
				3: "Any Level. Adaptive, LTA racers only",
				4: "No Novices or adaptive rowers or equipment allowed on the water",
				5: "No Novices or adaptive rowers or equipment allowed on the water",
				6: "No Novices or adaptive rowers or equipment allowed on the water",
				7: "None required for staying on land"
			},
		
			additionalSafetyItems: {
				1: "Optional",
				2: "One Space Blanket per rower in launch",
				3: "One Space Blanket per rower in launch",
				4: "One Space Blanket per rower in launch",
				5: "One Space Blanket per rower in launch",
				6: "One Space Blanket per rower in launch; one bailer/large sponge/pump in each shell"
			},
		
			addenda: {
				1: "See TRRA website for links to official gauges for water flow (NOAA data from Sharpsburg gauge -- scroll down for flow and use the most recent \"observed data\" regardless of listed time) and water temperature (USGS data from Acmetonia).",
				2: {
					title: "Additional Requirements for Zone 6:",
					count: 7,
					1: "A meeting and letter must be provided to TRRA before rowing in these conditions. A standard letter can be found on the TRRA website.",
					2: "Crews must be strong enough to make meaningful progress upstream through the Millvale cut with not more than 3/4's of rowers rowing",
					3: "Crews must have not less than 2 hours of on-the-water time within the immediately preceding 5-day period",
					4: "Daylight, as defined above, required. You may not shift to the left in daylight from Zone 6 to Zone 5",
					5: "No more than 8 mph of sustained wind in the opposite direction from the current",
					6: "Demonstrate rescue techniques to TRRA staff's satisfaction",
					7: "For youth oriented organizations - Required Parent Group board member representation at each of TRRA's semi-annual Safety Meetings."
				},
				3: "There are various kinds of PFDs available. The TRRA Safety Committee recommends that each rowing program research PFDs to determine which type is best for its members' use. <b>PLEASE NOTE, however, that the TRRA Safety Committee is aware that certain PFD manufacturers do not recommend use of CO<sub>2</sub> inflatable PFDs in air or water conditions below 40° Fahrenheit (4.5° Celcius)."
			}
		
		},
	
		//	primary duty function
		zoneForConditions: function (waterFlow, waterTemp, sunrise, sunset) {
            var isDaylight = false;
			if (moment != null) {
				var now = moment();
				var afterDawn = now.isAfter(sunrise);
				var beforeDusk = now.isBefore(sunset);
                isDaylight = (afterDawn && beforeDusk);
			}
            let tempF = 32.0 + ((9/5) * Number(waterTemp));
            var zoneFor2021Matrix = getZoneForConditions(Number(waterFlow), tempF, isDaylight);
			return zoneFor2021Matrix;
		},
		
		zoneColorForWaterFlow: function (waterFlow) {
			let zone = rank(waterFlow, this.scales.waterFlow);
			let color = semanticColors[zone];
			return color;
		},
		
		zoneColorForWaterTemp: function (waterTemp) {
			let zone = rank(waterTemp, this.scales.waterTemp);
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
