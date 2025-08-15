
	
class RiverStatusConfig {
	
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
 * A safety zone has a value (intended to be displayed as a single character)
 * and a color, and also probably some notion of being ordered
 * 
 * its core data structure is a list of zones which itself contains a mapping
 * of datapoint identifiers to threshold values 
 */
class SafetyZone {

	UNKNOWN = SafetyZone({ value: "?", color: 'gray'})

	constructor({value, color}) {
		/**
		  * the value displayed to the user when in this zone. Should be one effective character (letter, number, symbol, emoji, etc)
		 */
		this.value = value;
		this.color = color;

		/**
		 * The conditions under which this safety zone is active
		 * This is a map from datapoint identifiers to the minimum values
		 */
		this.conditions = [

		]

		//textual summary of limitations on rowing in this zone
		this.restrictions = []
	}
}




/**
 * This is a configuration object that should be able to represent many variations of the safety matrix concept
 * it allows values for different data fields (identified by [DatapointIdentifier] enum values) to be mapped to any number of safety zones (identified by arbitrary symbols and colors that are shown to users)
 */
class SafetyMatrix {

	constructor({safetyZones, unsafeZone}) {
		/**
		 * ordered list of SafetyZones, safest to least safe
		 */
		this.safetyZones = safetyZones
		this.unsafeZone = unsafeZone

		// TODO: place to store optional link to view the clubs underlying safety matrix document

	}


	getZoneForValue(datapointId, value){

	}
	
}

let ritconfig = new RiverStatusConfig({
	riverName: "Genesee",
	clubFullName: "RIT Rowing",
	clubAcronym: "RIT",
	boathouseLat: 43.064251,
	boathouseLong: -77.699065,
	safetyMatrix: SafetyMatrix(),
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

let config = ritconfig;

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
