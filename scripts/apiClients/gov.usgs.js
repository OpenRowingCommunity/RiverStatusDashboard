//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.usgs.js created on 2017-06-26




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


	async _getDatapoint(apiId, path = "", start_datestamp = undefined, end_datestamp = undefined, parameters = {}) {
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
		switch (datapointId) {
			case DatapointIdentifier.WATER_FLOW:
				return this._getDatapoint( apiId, {
					parameterCd: '00060'
				}).then((data) => {
					var value = data.value.timeSeries[0].values[0].value[0].value;
					return this.dataTransformers[datapointId](value);
				});
			case DatapointIdentifier.WATER_TEMP:
				return this._getDatapoint( apiId, {
					parameterCd: '00010'
				}).then((data) => {
					var value = data.value.timeSeries[0].values[0].value[0].value;
					return this.dataTransformers[datapointId](value);
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

var gov_usgs = new USGS();
