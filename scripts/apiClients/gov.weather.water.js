//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.weather.js created on 2017-06-26
//		refactored 2023-09-01 by Adrian Edwards

import { APIClient, DataPoint } from "./apiclient.js"
import { APIClientIdentifier, DatapointIdentifier } from '../constants.js';

export class NOAAWeatherWater extends APIClient {
	// https://api.water.noaa.gov/nwps/v1/docs/#/
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

	/**
	 * Fetch many (historical) values for a particular datapoint
	 * 
	 * @param {*} datapointId the identifier of the datapoint to fetch
	 * @param {*} apiId the identifier as needed
	 * @returns an array of DataPoint objects
	 */
	async getDatapoints(datapointId, apiId, parameters = {} ) {
		return this._queryData(apiId, parameters, '/gauges/' + apiId + "/stageflow").then((raw_data) => {
			// we ignore forecast data for now. we dont have a use for it

			// this data source does not obey the date and time filtering parameters that the other APIs do, so we have to remove unnecessary data manually.
			let data = raw_data.observed.data.filter((v) => moment(v.validTime) >= moment(parameters.startDT));
			// filtered_data.forecast.data = data.forecast.data.filter((v) => moment(v.validTime) >= moment(parameters.startDT)) 

			// convert from the "primary/secondary flood/flow combined data into a single "value" and "units"
			switch (datapointId) {
				case DatapointIdentifier.WATER_FLOW:
					data.map((dataitem) => {
						dataitem.value = dataitem.secondary
						dataitem.units = this.dataUnits[datapointId]
						delete dataitem.primary
						delete dataitem.secondary
					})
					break;
				case DatapointIdentifier.WATER_LEVEL:
					data.map((dataitem) => {
						dataitem.value = dataitem.primary
						dataitem.units = this.dataUnits[datapointId]
						delete dataitem.primary
						delete dataitem.secondary
					})
					break;
				default:
					console.error("datapoint " + datapointId + " not supported by client " + this.id);
			}
			
			//run all the values through the transformer
			// map the datestamps and qualifiers and stuff on them
			data.map((dataitem) => {
				
				return new DataPoint(
					this.dataTransformers[datapointId](dataitem.value),
					moment(dataitem.validTime).toDate(),
					this.dataUnits[datapointId],
					this.id,
					null, // no qualifiers
					moment(dataitem.generatedTime).toDate()
				)
			});
			return data
		});
	}


	getUnits(datapointId) {
		return dataUnits[datapointId]
	}

	supportedDatapoints() {
		return this.dataTransformers.keys()
	}
}