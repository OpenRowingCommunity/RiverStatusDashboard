//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.weather.js created on 2017-06-26
//		refactored 2023-09-01 by Adrian Edwards


class NOAAWeatherWater extends APIClient {

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
						console.log(data)
						console.log(data.status.observed.primary)
						// get from data -- XPaths?
						var datum = $(data).find('observed > datum:first');
						// var flowUnits = $(datum).find('secondary').attr('units');
						var flowValue = $(datum).find('secondary').text();

						return this.dataTransformers[datapointId](flowValue);
					});
			case DatapointIdentifier.WATER_LEVEL:
				return this._queryData(apiId)
					.then(async (data) => {
						// get from data
						var datum = $(data).find('observed > datum:first');
						// var floodUnits = $(datum).find('primary').attr('units');
						var floodValue = $(datum).find('primary').text();
						return this.dataTransformers[datapointId](floodValue);
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


var gov_weather_water = new NOAAWeatherWater();
