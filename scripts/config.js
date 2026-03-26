import { APIClientIdentifier, DatapointIdentifier } from './constants.js';
import { toCelsius, validateNumber } from './helpers.js';
import { ritconfig } from './clubs/rit.js';
import { trraconfig } from './clubs/trra.js';

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

class Conditional {

	constructor(conditions) {
		/**
		 * The conditions under which this class or any derived subclasses applies
		 * These will be checked in order. The last one that has a match with any current conditions will be used
		 */
		this.conditions = conditions;
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
		if (typeof(this.conditions) === 'undefined' || this.conditions.length == 0){
			return true
		}
		return Array.from(this.conditions).map((condition) => condition.evaluate(values[condition.datapointId])).some((v) => v);
	}
}

/**
 * Represents a textual summary of what limitations are in place when in this safety zone
 */
export class Restriction extends Conditional {

	constructor({category, description, conditions = undefined}) {
		super(conditions)
		this.category = category;
		if (typeof(description) === 'string') {
			this.description = [description]
		} else {
			this.description = description;
		}
	}

	get hasCategory() {
		return typeof(this.category) !== 'undefined' && this.category !== "";
	}

	get htmlDescription() {
		return this.description.join();
	}
}


/**
 * Represents set of conditions based on a range of values for a specific data point.
 * Used to determine the current safety zone
 */
export class Condition {

	constructor(datapointId, {min, max, unit}) {
		this.datapointId = datapointId;
		this.unit = unit;

		const hasMax = validateNumber(max);
		const hasMin = validateNumber(min);  

		if (!hasMax && !hasMin){
			throw new Error("Condition with no values cannot be evaluated")
		} else if (!hasMax || !hasMin) {
			// one value is not valid
			this.lowerBound = hasMin? Number(min) : undefined;
			this.upperBound = hasMax? Number(max) : undefined;
		} else {
			min = Number(min);
			max = Number(max);

			// regardless of the order they are entered, ensure the largest number is the upperBound
			this.lowerBound = Math.min(min, max);
			this.upperBound = Math.max(min, max);
		}
	}

	evaluate(value) {
		const atLeast = this.lowerBound ? value >= this.lowerBound: true;
		const notBeyond = this.upperBound ? value < this.upperBound : true;

		return atLeast && notBeyond;
	}
}

export class LessThan extends Condition {
	constructor(datapointId, max, unit = undefined) {
		super(datapointId, {max, unit})
	}
}

export class AtLeast extends Condition {
	constructor(datapointId, min, unit = undefined) {
		super(datapointId, {min, unit})
	}
}
export const GreaterThan = AtLeast;

export class Between extends Condition {
	constructor(datapointId, min, max, unit = undefined) {
		super(datapointId, {min, max, unit})
	}
}

/**
 * A safety zone has a value (intended to be displayed as a single character)
 * and a color, and also probably some notion of being ordered
 * 
 * its core data structure is a list of zones which itself contains a mapping
 * of datapoint identifiers to threshold values 
 */
export class SafetyZone extends Conditional {

	get UNKNOWN() {
		return new SafetyZone({label: "?", color: 'gray'})
	}

	/**
	 * 
	 * @param {*} label the value displayed to the user when in this zone. Should be one effective character (letter, number, symbol, emoji, etc) 
	 * @param {*} color  the color this zone will show as (background for the label)
	 * @param {*} conditions The conditions under which this safety zone is active
	 * @param {*} restrictions Restriction objects describing limitations of this zone
	 */
	constructor({label, color="gray", conditions=[], restrictions=[]}) {
		super(conditions)
		this.label = label;
		this.color = color;

		/** list of objects representing textual descriptions of limitations on
		 * rowing when in this zone applies */
		this.restrictions = restrictions
	}

	getRestrictionsForData(values) {
		return this.restrictions.filter((r) => r.isTriggeredBy(values))
	}
}




/**
 * This is a configuration object that should be able to represent many variations of the safety matrix concept
 * it allows values for different data fields (identified by [DatapointIdentifier] enum values) to be mapped to any number of safety zones (identified by arbitrary symbols and colors that are shown to users)
 */
export class SafetyMatrix {

	constructor({safetyZones, unsafeZone, version, source}) {
		/**
		 * ordered list of SafetyZones, safest to least safe
		 */
		this.safetyZones = safetyZones
		this.unsafeZone = unsafeZone
		this.version = version
		this.source = source

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
				continue
			}
		}
		return selectedZone;
	}
	
}

let allClubs = {
	"RIT": ritconfig,
	"TRRA": trraconfig
}

const getConfig = () => {
	const fragment = window.location.hash.substring(1);
	console.log(fragment);
	if (Object.keys(allClubs).includes(fragment)){
		return allClubs[fragment]
	}
	return trraconfig
}

// determine config
export let config = getConfig();

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
