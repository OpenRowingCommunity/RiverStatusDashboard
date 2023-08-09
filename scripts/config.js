
	
class RiverStatusConfig {
	
	constructor({riverName, clubFullName, clubAcronym, boathouseLat, boathouseLong, usgsSiteIDs, noaaGageId, localAirportCallsign }) {
		this.riverName = riverName;
		this.clubFullName = clubFullName;
		this.clubAcronym = clubAcronym;
		this.boathouseLat = boathouseLat;
		this.boathouseLong = boathouseLong;
		this.usgsSiteIDs = usgsSiteIDs;
		this.noaaGageId = noaaGageId;
		this.localAirportCallsign = localAirportCallsign;

		//TODO: include the safety matrix in this data
		// this.safetyMatrix 
	}
}

let ritconfig = new RiverStatusConfig({
	riverName: "Genesee",
	clubFullName: "RIT Rowing",
	clubAcronym: "RIT",
	boathouseLat: 43.064251,
	boathouseLong: -77.699065,
	usgsSiteIDs: [
		"04230650",
		"04231600"
	],
	noaaGageId: "blbn6",
	localAirportCallsign: "KROC"
});

let trraconfig = new RiverStatusConfig({
	riverName: "Allegheny",
	clubFullName: "Three Rivers Rowing Association",
	clubAcronym: "TRRA",
	boathouseLat: 40.466846,
	boathouseLong: -79.976543,
	usgsSiteIDs: [
		"03049640"
	],
	noaaGageId: "shrp1",
	localAirportCallsign: "KPIT"
});

let config = ritconfig;

// (async () => {
//     config = await fetch("./config.json").then(response => response.json());
// })();
