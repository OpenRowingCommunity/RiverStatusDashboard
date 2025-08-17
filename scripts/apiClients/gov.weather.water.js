//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.weather.js created on 2017-06-26
//		refactored 2023-09-01 by Adrian Edwards

import { APIClient } from "./apiclient.js"
import { APIClientIdentifier, DatapointIdentifier } from '../constants.js';

export class NOAAWeatherWater extends APIClient {

	constructor() {
		super('https://api.water.noaa.gov/nwps/v1', APIClientIdentifier.NOAA_WATER)
	}
	dataTransformers = {
		[DatapointIdentifier.WATER_FLOW]: (v) => v,
		[DatapointIdentifier.WATER_LEVEL]: (v) => v,
	}

	dataUnits = {
		[DatapointIdentifier.WATER_FLOW]: 'kcfs',
		[DatapointIdentifier.WATER_LEVEL]: "ft",
	}


	async _queryData(apiId, parameters = {}, path = "", start_datestamp = undefined, end_datestamp = undefined) {
		if (path == "")	{
			path = '/gauges/' + apiId;
		}
		return super.request(path, parameters).then(async (response) => response.json());
	}

	async getDatapoint(datapointId, apiId) {
		//TODO: check cache
		switch (datapointId) {
			case DatapointIdentifier.WATER_FLOW:
				return this._queryData(apiId)
					.then(async (data) => {
						// ....observed.secondaryUnit
						return this.dataTransformers[datapointId](data.status.observed.secondary);
					});
			case DatapointIdentifier.WATER_LEVEL:
				return this._queryData(apiId)
					.then(async (data) => {
						// ....observed.primaryUnit	
						return this.dataTransformers[datapointId](data.status.observed.primary);
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