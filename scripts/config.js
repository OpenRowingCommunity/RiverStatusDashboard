
	
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

	getDataSourcesByType(type) {
		return this.dataSources.filter((src) => src.type === type);
	}

	//TODO: support optional purposeHints and allow for trying each data source matching the right type to see if it has the data or not
	getDataSourcesByPurpose(purpose) {
		return this.dataSources.filter((src) => src.purposeHints.includes(purpose));
	}

	filterDataSources(type, purpose) {
		if (type === undefined) {
			return this.getDataSourcesByPurpose(purpose)
		} else if (purpose === undefined) {
			return this.getDataSourcesByType(type)
		} else {
			let typematch_sources = this.getDataSourcesByType(type)

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
			type: "usgs",
			id: "04230650",
			purposeHints: ["waterflow"],
			comment: "Jefferson Bridge"
		},
		{
			type: "usgs",
			id: "04231600",
			purposeHints: ["watertemp"],
			comment: "Ford St. Bridge"
		},
		{
			type: "noaa-water",
			id: "blbn6",
			purposeHints: ["waterlevel"],
			comment: "Jefferson Road Bridge"
		},
		{
			type: "noaa-weather",
			id: "KROC",
			purposeHints: ["airtemp", "airspeed", "airdirection"],
			comment: "Greater Rochester International Airport"
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
			type: "usgs",
			id: "03049640",
			purposeHints: ["watertemp"],
			comment: "Allegheny R at CW Bill Young L&D at Acmetonia, PA"
		},
		{
			type: "noaa-weather",
			id: "KPIT",
			purposeHints: ["airtemp", "airspeed", "airdirection"],
			comment: "Pittsburgh International Airport"
		},
		{
			type: "noaa-water",
			id: "shrp1",
			purposeHints: ["waterlevel", "waterflow"],
			comment: "Allegheny River at Sharpsburg Lock and Dam"
		}
	]
});

let config = ritconfig;

// (async () => {
//     config = await fetch("./config.json").then(response => response.json());
// })();
