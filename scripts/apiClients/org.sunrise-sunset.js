//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		org.sunrise-sunset.js created on 2017-06-26
//		refactored 2023-09-01 by Adrian Edwards

//	requirejs(['moment']); ?		//	<- expects moment to be available in the global ns

import { config } from "../config.js"
import { APIClient } from "./apiclient.js"
import { APIClientIdentifier, DatapointIdentifier } from '../constants.js';
import { timeFormatter } from "../helpers.js";


export class SunriseSunsetOrg extends APIClient {

	constructor() {
		super('https://api.sunrise-sunset.org/json', APIClientIdentifier.SUNRISE_SUNSET_ORG)
	}
	dataTransformers = {
		[DatapointIdentifier.SUNRISE]: timeFormatter,
		[DatapointIdentifier.SUNSET]: timeFormatter,
	}

	dataUnits = {
		[DatapointIdentifier.SUNRISE]: '',//time
		[DatapointIdentifier.SUNSET]: "",//time
	}


	async _queryData(apiId, parameters = {}, path = "", start_datestamp = undefined, end_datestamp = undefined) {
		let params = {
			lat: config.boathouseLat,
			lng: config.boathouseLong,
			date: moment().format('YYYY-MM-DD'),
			formatted: 0
		}

		//combine input parameters with defaults
		params = Object.assign({}, params, parameters);

		return super.request(path, params)
	}

	async getDatapoint(datapointId, apiId) {
		//TODO: check cache
		switch (datapointId) {
			case DatapointIdentifier.SUNRISE:
				return this._queryData(apiId)
					.then(async (response) => {
						var data = await response.json()
						return this.dataTransformers[datapointId](data.results.sunrise);
					});
			case DatapointIdentifier.SUNSET:
				return this._queryData(apiId)
					.then(async (response) => {
						var data = await response.json()
						return this.dataTransformers[datapointId](data.results.sunset);
					});
			default:
				console.log("datapoint " + datapointId + " not supported by client " + this.id);
		}
	}

	getUnits(datapointId) {
		return dataUnits[datapointId]
	}

	supportedDatapoints() {
		return this.dataTransformers.keys()
	}
}