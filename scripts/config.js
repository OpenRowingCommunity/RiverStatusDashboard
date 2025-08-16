import { APIClientIdentifier, DatapointIdentifier } from './constants.js';

export class RiverStatusConfig {
	
	constructor({riverName, clubFullName, clubAcronym, boathouseLat, boathouseLong, safetyMatrix, dataSources }) {
		this.riverName = riverName;
		this.clubFullName = clubFullName;
		this.clubAcronym = clubAcronym;
		this.boathouseLat = boathouseLat;
		this.boathouseLong = boathouseLong;
		this.dataSources = dataSources;
		this.safetyMatrix = safetyMatrix; //TODO: make optional
	}

	/**
	 * return the list of data sources for this configuration showing only those of a specific type
	 * @param {*} type the [APIClientIdentifier] of the data source to filter for
	 * @returns a filtered list of data sources showing only those belonging to the specified data source
	 */
	getDataSourceDetailsByType(type) {
		return this.dataSources.filter((src) => src.type === type);
	}

	/**
	 * return the list of data sources for this configuration showing only those containing a particular purpose hint
	 * @param {*} purpose the [DatatypeIdentifer] indicating the data points to filter for
	 * @returns a filtered list of data sources showing only those containing the specific datapoint hint
	 */
	//TODO: support optional purposeHints and allow for trying each data source matching the right type to see if it has the data or not
	getDataSourceDetailsByPurpose(purpose) {
		return this.dataSources.filter((src) => src.purposeHints.includes(purpose));
	}

	/**
	 * filter data sources by both type and purpose
	 * @param {*} type 
	 * @param {*} purpose 
	 * @returns 
	 */
	getDataSourceDetails(type, purpose) {
		if (type === undefined) {
			return this.getDataSourceDetailsByPurpose(purpose)
		} else if (purpose === undefined) {
			return this.getDataSourceDetailsByType(type)
		} else {
			let typematch_sources = this.getDataSourceDetailsByType(type)

			let results = typematch_sources.filter((src) => src.purposeHints.includes(purpose));

			if (results.length >= 1) {
				return results
			} else {
				return typematch_sources
			}
		}
	}
}

/**
 * Represents a textual summary of what limitations are in place when in this safety zone
 */
export class SafetyZoneRestriction {

	constructor({category, description}) {
		this.category = category;
		this.description = description;
	}
}

/**
 * Represents a datapoint and threshold for data values.
 * Used to determine the current safety zone
 */
export class SafetyCondition {

	constructor(datapointId, {min, max, unit, higherIsWorse = true}) {
		this.datapointId = datapointId;
		// regardless of the order they are entered, ensure the largest number is the upperBound
		this.lowerBound = max ? Math.min(min, max) : min ;
		this.upperBound = max ? Math.max(min, max): undefined;
		this.higherIsWorse = higherIsWorse;
	}

	evaluate(value) {
		const atLeast = value >= this.lowerBound;
		const notBeyond = this.upperBound ? value < this.upperBound : true;

		return atLeast && notBeyond;
	}
}

/**
 * A safety zone has a value (intended to be displayed as a single character)
 * and a color, and also probably some notion of being ordered
 * 
 * its core data structure is a list of zones which itself contains a mapping
 * of datapoint identifiers to threshold values 
 */
export class SafetyZone {

	get UNKNOWN() {
		return new SafetyZone({label: "?", color: 'gray'})
	}

	/**
	 * 
	 * @param {*} label the value displayed to the user when in this zone. Should be one effective character (letter, number, symbol, emoji, etc) 
	 * @param {*} color  the color this zone will show as (background for the label)
	 * @param {*} conditions The conditions under which this safety zone is active
	 * @param {*} restrictions SafetyZoneRestriction objects describing limitations of this zone
	 */
	constructor({label, color="gray", conditions={}, restrictions=[]}) {
		this.label = label;
		this.color = color;

		/**
		 * The conditions under which this safety zone is active
		 * This is a map from datapoint identifiers to the minimum values
		 */
		this.conditions = conditions

		/** list of objects representing textual descriptions of limitations on
		 * rowing when in this zone applies */
		this.restrictions = restrictions
	}

	/**
	 * determines whether this safety zones criteria are met by the given input data
	 * 
	 * a zones criteria are met if any current value is above the threshold defined in the zone
	 * 
	 * @param {*} values an object containing every possible datapoint identifier
	 * (as keys of an object) and their current values
	 * 
	 * @returns boolean indicating whether or not this zones criteria are met 
	 */
	isTriggeredBy(values){
		return this.conditions.map((condition) => condition.evaluate(values[condition.datapointId])).some((v) => v)
	}
}




/**
 * This is a configuration object that should be able to represent many variations of the safety matrix concept
 * it allows values for different data fields (identified by [DatapointIdentifier] enum values) to be mapped to any number of safety zones (identified by arbitrary symbols and colors that are shown to users)
 */
export class SafetyMatrix {

	constructor({safetyZones, unsafeZone}) {
		/**
		 * ordered list of SafetyZones, safest to least safe
		 */
		this.safetyZones = safetyZones
		this.unsafeZone = unsafeZone

		// TODO: place to store optional link to view the clubs underlying safety matrix document

	}

	/**
	 * provides the safety zone that applies according to the given input data
	 * @param {*} data an object containing every possible datapoint identifier
	 * as its keys and containing their current values
	 * 
	 * @returns the current SafetyZone that applies given the current data
	 */
	getZoneForData(data) {
		if (!this.safetyZones) {
			return SafetyZone.UNKNOWN;
		}

		// add the unsafezone to the end of the list when evaluating
		let zones = Array.from(this.safetyZones);
		if (this.unsafeZone){
			zones.push(this.unsafeZone);
		}

		var selectedZone = SafetyZone.UNKNOWN;

		for (const zone of zones) {
			if (zone.isTriggeredBy(data)) {
				selectedZone = zone;
			} else {
				break
			}
		}
		return selectedZone;
	}
	
}

let ritconfig = new RiverStatusConfig({
	riverName: "Genesee",
	clubFullName: "RIT Rowing",
	clubAcronym: "RIT",
	boathouseLat: 43.064251,
	boathouseLong: -77.699065,
	safetyMatrix: new SafetyMatrix({
		safetyZones: [

		],
		unsafeZone: new SafetyZone('☠️')
	}),
	dataSources: [
		{
			type: APIClientIdentifier.USGS,
			id: "04230650",
			purposeHints: [DatapointIdentifier.WATER_FLOW],
			comment: "Jefferson Bridge"
		},
		{
			type: APIClientIdentifier.USGS,
			id: "04231600",
			purposeHints: [DatapointIdentifier.WATER_TEMP],
			comment: "Ford St. Bridge"
		},
		{
			type: APIClientIdentifier.NOAA_WATER,
			id: "blbn6",
			purposeHints: [DatapointIdentifier.WATER_LEVEL],
			comment: "Jefferson Road Bridge"
		},
		{
			type: APIClientIdentifier.NOAA_W1,
			id: "KROC",
			purposeHints: [DatapointIdentifier.AIR_TEMP, DatapointIdentifier.AIR_SPEED, DatapointIdentifier.AIR_DIRECTION],
			comment: "Greater Rochester International Airport"
		},
		{
			type: APIClientIdentifier.AIRNOW,
			id: "Eastern_Lake_Ontario_Region_NY",
			purposeHints: [DatapointIdentifier.AIR_QUALITY],
			friendlyPage: "https://www.airnow.gov/?city=Rochester&state=NY&country=USA",
			comment: "Eastern Lake Ontario Region"
		},
	]
});

let trraconfig = new RiverStatusConfig({
	riverName: "Allegheny",
	clubFullName: "Three Rivers Rowing Association",
	clubAcronym: "TRRA",
	boathouseLat: 40.466846,
	boathouseLong: -79.976543,
	dataSources: [
		{
			type: APIClientIdentifier.USGS,
			id: "03049640",
			purposeHints: [DatapointIdentifier.WATER_TEMP],
			comment: "Allegheny R at CW Bill Young L&D at Acmetonia, PA"
		},
		{
			type: APIClientIdentifier.NOAA_W1,
			id: "KPIT",
			purposeHints: [DatapointIdentifier.AIR_TEMP, DatapointIdentifier.AIR_SPEED, DatapointIdentifier.AIR_DIRECTION],
			comment: "Pittsburgh International Airport"
		},
		{
			type: APIClientIdentifier.NOAA_WATER,
			id: "shrp1",
			purposeHints: [DatapointIdentifier.WATER_LEVEL, DatapointIdentifier.WATER_FLOW],
			comment: "Allegheny River at Sharpsburg Lock and Dam"
		}
	]
});

export let config = ritconfig;

//Add "shared"/common data sources that do not require site identification strings
config.dataSources.push(...[
	{
		type: APIClientIdentifier.SUNRISE_SUNSET_ORG,
		purposeHints: [DatapointIdentifier.SUNRISE, DatapointIdentifier.SUNSET],
		comment: ""
	}
])

if (!config.plotColors) {
	config.plotColors = {
		flow: '#0088ff',
		flood: '#00ff00',
		temperature: '#ff0000'
	}
}

// (async () => {
//     config = await fetch("./config.json").then(response => response.json());
// })();
