//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		apiConcierge.js created on 2017-06-26

let mockData = {
	waterFlow: 32.9,
	waterTemp: 21.3,
	waterLevel: 12.9,
	airTemp: 22.4,
	airSpeed: 2.7,
	airDirxn: 227,
	sunrise: null,
	sunset: null
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
		'waterFlow': config.clubAcronym === "TRRA"?  gov_weather_water.getWaterFlow : gov_usgs.getWaterFlow,
		'waterLevel': gov_weather_water.getWaterLevel,
		'waterTemp': gov_usgs.getWaterTemp,
		'airTemp': gov_weather_w1.getAirTemp,
		'airSpeed': gov_weather_w1.getAirSpeed,
		'airDirxn': gov_weather_w1.getAirDirxn,
		'sunrise': org_sunrise_sunset.getSunrise,
		'sunset': org_sunrise_sunset.getSunset
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
