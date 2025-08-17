//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		org.openweathermap.js created on 2018-11-01
//		refactored 2023-09-01 by Adrian Edwards
import { APIClient } from "./apiclient.js"
import { APIClientIdentifier, DatapointIdentifier } from '../constants.js';
import { airDirxnFormatter } from "../helpers.js";

export class NOAAWeather extends APIClient {

	NO_DATA_VALUE = 999;

	constructor() {
		// You can continue to use the existing legacy services on forecast.weather.gov, but we encourage you to move to the API when you can. We have more resources dedicated to supporting the API and much of our future development will be focused here.
		// https://weather-gov.github.io/api/general-faqs
		super('https://forecast.weather.gov/xml/current_obs/display.php', APIClientIdentifier.NOAA_W1)
	}
	dataTransformers = {
		[DatapointIdentifier.AIR_DIRECTION]: airDirxnFormatter,
		[DatapointIdentifier.AIR_SPEED]: (v) => v,
		[DatapointIdentifier.AIR_TEMP]: (v) => v,

	}

	dataUnits = {
		[DatapointIdentifier.AIR_DIRECTION]: "", //cardinal directions are unitless
		[DatapointIdentifier.AIR_SPEED]: "mph",
		[DatapointIdentifier.AIR_TEMP]: "˚C",
	}


	async _queryData(apiId, parameters = {}, path = "", start_datestamp = undefined, end_datestamp = undefined) {
		let params = {
			stid: apiId
		}

		//combine input parameters with defaults
		params = Object.assign({}, params, parameters);

		return super.request(path, params)
	}

	async getDatapoint(datapointId, apiId) {
		//TODO: check cache
		switch (datapointId) {
			case DatapointIdentifier.AIR_TEMP:
				return this._queryData(apiId)
					.then(async (response) => {
						var data = await response.text()
						var apiData = $(data).find('temp_c').text();
						return this.dataTransformers[datapointId](apiData);
					});
			case DatapointIdentifier.AIR_SPEED:
				return this._queryData(apiId)
					.then(async (response) => {
						var data = await response.text()
						var apiData = $(data).find('wind_mph').text();

						return this.dataTransformers[datapointId](apiData);
					});
			case DatapointIdentifier.AIR_DIRECTION:
				return this._queryData(apiId)
					.then(async (response) => {
						var data = await response.text()
						var apiData = $(data).find('wind_degrees').text()
						var fallback_dir = $(data).find('wind_dir').text()

						if (apiData == this.NO_DATA_VALUE) {
							return fallback_dir
						}

						return this.dataTransformers[datapointId](apiData);
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