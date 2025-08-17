//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		apiConcierge.js created on 2017-06-26

import { AirNow } from './apiClients/gov.airnow.js';
import { USGS } from './apiClients/gov.usgs.js';
import { NOAAWeather } from './apiClients/gov.weather.w1.js';
import { NOAAWeatherWater } from './apiClients/gov.weather.water.js';
import { SunriseSunsetOrg } from './apiClients/org.sunrise-sunset.js';
import { config } from './config.js';
import { APIClientIdentifier, DatapointIdentifier } from './constants.js';


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

export let apiConcierge = {
	
	// skip AJAX requests
	usingMockData: false,
	
	// https-only, i.e. omit openweather requests that violate CSP
	usingHttpsOnly: true,
	
	// for an API domain, which apiClient
	clientMap: {
		[APIClientIdentifier.NOAA_WATER]: new NOAAWeatherWater(),
		[APIClientIdentifier.NOAA_W1]: new NOAAWeather(),
		[APIClientIdentifier.USGS]: new USGS(),
		[APIClientIdentifier.SUNRISE_SUNSET_ORG]: new SunriseSunsetOrg(),
		[APIClientIdentifier.AIRNOW]: new AirNow()
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
			 return mockData[valueId];
		}
		
		let details = this._getConfigDetails(valueId);
		let client = this.clientMap[details.type];
		return client.getDatapoint(valueId, details.id).then((v) => setterFunc(v));
	},

	/**
	 * 
	 * @param {*} valueId a unique identifier (string or int) of the datapoint for which the unit is sought
	 * @returns 
	 */
	getUnit: function (valueId) {
		let details = this._getConfigDetails(valueId);
		let client = this.clientMap[details.type];
		return client.getUnits(valueId);
	},

	/**
	 * 
	 * @param {*} valueId a unique identifier (string or int) of the value sought
	 * @param {*} setterFunc the function to be used to set the value once retrieved
	 * @returns 
	 */
	getValuesAsync: async function (valueId, parameters = {}) {
		let details = this._getConfigDetails(valueId);
		let client = this.clientMap[details.type];
		return client.getDatapoints(valueId, details.id, parameters);
	},

	_getConfigDetails: function (valueId) {
		let details = config.getDataSourceDetails(undefined, valueId);
		if (details.length == 0 ){
			console.log("no config found - searching for " + valueId)
		} else {
			details = details[0]
		}
		return details
	}
	
};

// EOF
