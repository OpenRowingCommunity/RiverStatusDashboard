
	
class RiverStatusConfig {
	
	constructor({riverName, clubFullName, clubAcronym, boathouseLat, boathouseLong, dataSources }) {
		this.riverName = riverName;
		this.clubFullName = clubFullName;
		this.clubAcronym = clubAcronym;
		this.boathouseLat = boathouseLat;
		this.boathouseLong = boathouseLong;
		this.dataSources = dataSources;

		//TODO: include the safety matrix in this data
		// this.safetyMatrix 
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

let ritconfig = new RiverStatusConfig({
	riverName: "Genesee",
	clubFullName: "RIT Rowing",
	clubAcronym: "RIT",
	boathouseLat: 43.064251,
	boathouseLong: -77.699065,
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
			id: "Eastern Lake Ontario Region, NY",
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
