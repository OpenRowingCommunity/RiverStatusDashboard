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


//	Object-Based Version

let apiConcierge = {
	
	// skip AJAX requests
	usingMockData: false,
	
	// https-only, i.e. omit openweather requests that violate CSP
	usingHttpsOnly: true,
	
	// for an API domain, which apiClient
	clientMap: {
		[APIClientIdentifier.NOAA_WATER]: gov_weather_water,
		[APIClientIdentifier.NOAA_W1]: gov_weather_w1,
		[APIClientIdentifier.USGS]: gov_usgs,
		[APIClientIdentifier.SUNRISE_SUNSET_ORG]: org_sunrise_sunset
	},

	_getClient: function (datapointId) {
		let details = config.getDataSourceDetails(undefined, datapointId);
		if (details.length == 0 ){
			console.log("no config found - searching for " + datapointId)
		} else {
			//TODO: handle multiple data source matches by trying them one by one (because they are assumed to be in preference order) until one succeeds
			details = details[0]
		}
		let client = this.clientMap[details.type];
		return client
	},
	
	// for a value, which API domain
	
	/**
	 * 
	 * @param {*} valueId a unique identifier (string or int) of the value sought
	 * @param {*} setterFunc the function to be used to set the value once retrieved
	 * @returns 
	 */
	getValueAsync: async function (valueId, setterFunc) {
		if (this.usingMockData) {				// if using mock data, short circuit
			//Why does this return when the non mock case calls a callback?
			 return mockData[valueId];
		}
		let client = this._getClient(valueId)
		
		return client.getDatapoint(valueId, details.id).then((v) => setterFunc(v));
	},

	/**
	 * 
	 * @param {*} valueId a unique identifier (string or int) of the value sought
	 * @param {*} setterFunc the function to be used to set the value once retrieved
	 * @returns 
	 */
	getValuesAsync: async function (valueId) {
		let client = this._getClient(valueId)
		return client.getDatapoints(valueId, details.id);
	}
	
};

// EOF
