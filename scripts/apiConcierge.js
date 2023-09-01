//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		apiConcierge.js created on 2017-06-26

// the square brackets in the keys allow the keys value to be computed.
// see https://stackoverflow.com/a/40720612/
let mockData = {
	[DatapointIdentifier.WATER_FLOW]: 32.9,
	[DatapointIdentifier.WATER_TEMP]: 21.3,
	[DatapointIdentifier.WATER_LEVEL]: 12.9,
	[DatapointIdentifier.AIR_TEMP]: 22.4,
	[DatapointIdentifier.AIR_SPEED]: 2.7,
	[DatapointIdentifier.AIR_DIRECTION]: 227,
	[DatapointIdentifier.SUNRISE]: null,
	[DatapointIdentifier.SUNSET]: null
};

let apiClients = {
	'water.weather.gov': gov_weather_water,
	'w1.weather.gov': gov_weather_w1,
	'usgs.gov': gov_usgs,
	'sunrise-sunset.org': org_sunrise_sunset
};

//	Object-Based Version

let apiConcierge = {
	
	// skip AJAX requests
	usingMockData: false,
	
	// https-only, i.e. omit openweather requests that violate CSP
	usingHttpsOnly: true,
	
	// for an API domain, which apiClient
	clientMap: {
		'water.weather.gov': gov_weather_water,
		'w1.weather.gov': gov_weather_w1,
		'usgs.gov': gov_usgs,
		'sunrise-sunset.org': org_sunrise_sunset
	},
	
	// for a value, which API domain
	accessorMap: {
		[DatapointIdentifier.WATER_FLOW]: config.clubAcronym === "TRRA"?  gov_weather_water.getWaterFlow : gov_usgs.getWaterFlow,
		[DatapointIdentifier.WATER_LEVEL]: gov_weather_water.getWaterLevel,
		[DatapointIdentifier.WATER_TEMP]: gov_usgs.getWaterTemp,
		[DatapointIdentifier.AIR_TEMP]: gov_weather_w1.getAirTemp,
		[DatapointIdentifier.AIR_SPEED]: gov_weather_w1.getAirSpeed,
		[DatapointIdentifier.AIR_DIRECTION]: gov_weather_w1.getAirDirxn,
		[DatapointIdentifier.SUNRISE]: org_sunrise_sunset.getSunrise,
		[DatapointIdentifier.SUNSET]: org_sunrise_sunset.getSunset
	},
	
	/**
	 * 
	 * @param {*} valueId a unique identifier (string or int) of the value sought
	 * @param {*} setterFunc the function to be used to set the value once retrieved
	 * @returns 
	 */
	getValueAsync: function (valueId, setterFunc) {
		if (this.usingMockData) {				// if using mock data, short circuit
			 return mockData[valueId];
		}
		let getter = this.accessorMap[valueId];
		getter(setterFunc);
	}
	
};

// EOF
