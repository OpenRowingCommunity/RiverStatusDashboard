//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.weather.js created on 2017-06-26
//		refactored 2023-09-01 by Adrian Edwards


class NOAAWeatherWater extends APIClient {

	constructor() {
		super('https://water.weather.gov/ahps2/hydrograph_to_xml.php')
		this.id = APIClientIdentifier.NOAA_WATER
	}
	dataTransformers = {
		[DatapointIdentifier.WATER_FLOW]: (v) => v,
		[DatapointIdentifier.WATER_LEVEL]: (v) => v,
	}

	dataUnits = {
		[DatapointIdentifier.WATER_FLOW]: 'kcfs',
		[DatapointIdentifier.WATER_LEVEL]: "ft",
	}


	async _getDatapoint(apiId, parameters = {}, path = "", start_datestamp = undefined, end_datestamp = undefined) {
		let params = {
			output: 'xml',		// switch to JSON? -- unsupported yet
			gage: apiId
		}

		//combine input parameters with defaults
		params = Object.assign({}, params, parameters);

		return super.request(path, params)
	}

	async getDatapoint(datapointId, apiId) {
		//TODO: check cache
		switch (datapointId) {
			case DatapointIdentifier.WATER_FLOW:
				return this._getDatapoint(apiId)
					.then(async (response) => {
						var data = await response.text()
						// get from data -- XPaths?
						var datum = $(data).find('observed > datum:first');
						// var flowUnits = $(datum).find('secondary').attr('units');
						var flowValue = $(datum).find('secondary').text();

						return this.dataTransformers[datapointId](flowValue);
					});
			case DatapointIdentifier.WATER_LEVEL:
				return this._getDatapoint(apiId)
					.then(async (response) => {
						var data = await response.text()
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
