//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.usgs.js created on 2017-06-26
//		refactored 2023-09-01 by Adrian Edwards

class USGS extends APIClient {

	constructor() {
		super('https://waterservices.usgs.gov/nwis/iv')
		this.id = APIClientIdentifier.USGS
	}

	dataTransformers = {
		[DatapointIdentifier.WATER_FLOW]: (v) => v/1000, //convert from cfs to kcfs
		[DatapointIdentifier.WATER_TEMP]: (v) => v,
	}

	dataUnits = {
		[DatapointIdentifier.WATER_FLOW]: 'kcfs',
		[DatapointIdentifier.WATER_TEMP]: "˚C",

	}


	async _getDatapoint(apiId, parameters = {}, path = "", start_datestamp = undefined, end_datestamp = undefined) {
		let params = {
			format: 'json',			// 'waterml,2.0' is old style
			sites: apiId,
			
			siteStatus: 'all'
		}

		if (start_datestamp != undefined && end_datestamp != undefined) {
			// if datestamps are present, this is a time series lookup
			// need restore the time period  for timeseries fetch
			params = Object.assign({}, params, {
				startDT: start_datestamp,
				endDT:end_datestamp
			});
		}
		//combine input parameters with defaults
		params = Object.assign({}, params, parameters);

		return super.request(path, params)
	}

	async getDatapoint(datapointId, apiId) {
		//TODO: check cache

		let query;

		switch (datapointId) {
			case DatapointIdentifier.WATER_FLOW:
				query = this._getDatapoint( apiId, {
					parameterCd: '00060'
				});
				break;
			case DatapointIdentifier.WATER_TEMP:
				query = this._getDatapoint( apiId, {
					parameterCd: '00010'
				});
				break;
			default:
				console.error("datapoint " + datapointId + " not supported by client " + this.id);
				return Promise.reject("datapoint " + datapointId + " not supported by client " + this.id)
		}
		// Process the data received
		// parse JSON
		//parse data out for this particular method call
		return query.then(async (response) => {
			var data = await response.json()
			var value = data.value.timeSeries[0].values[0].value[0].value;
			return this.dataTransformers[datapointId](value);
		});
	}

	getUnits(datapointId) {
		return dataUnits[datapointId]
	}

	supportedDatapoints() {
		return this.dataTransformers.keys()
	}
}

var gov_usgs = new USGS();
