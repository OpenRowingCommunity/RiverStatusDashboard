//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.usgs.js created on 2017-06-26
//		refactored 2023-09-01 by Adrian Edwards

class USGS extends APIClient {

	constructor() {
		super('https://waterservices.usgs.gov/nwis/iv', APIClientIdentifier.USGS)
	}

	dataTransformers = {
		[DatapointIdentifier.WATER_FLOW]: (v) => v/1000, //convert from cfs to kcfs
		[DatapointIdentifier.WATER_TEMP]: (v) => v,
	}

	dataUnits = {
		[DatapointIdentifier.WATER_FLOW]: 'kcfs',
		[DatapointIdentifier.WATER_TEMP]: "˚C",

	}

	/** A very low level internal helper that assembles parameters and makes a query to the API
	 * 
	 * @param {*} apiId 
	 * @param {*} parameters 
	 * @param {*} path 
	 * @param {*} start_datestamp 
	 * @param {*} end_datestamp 
	 * @returns 
	 */
	async _queryData(apiId, parameters = {}, path = "", start_datestamp = undefined, end_datestamp = undefined) {
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

	/** An internal helper that sets up and performs queries for particular data and does some extraction of that data from the result 
	 * 
	 * @param {*} datapointId 
	 * @param {*} apiId 
	 * @returns 
	 */
	async _fetchData(datapointId, apiId) {
		let query;

		switch (datapointId) {
			case DatapointIdentifier.WATER_FLOW:
				query = this._queryData( apiId, {
					parameterCd: '00060'
				});
				break;
			case DatapointIdentifier.WATER_TEMP:
				query = this._queryData( apiId, {
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
			let data = await response.json();
			return data.value.timeSeries[0].values[0].value
		});
	}
	
	/**
	 * Fetch a single datapoint, potentially from cached data
	 * 
	 * @param {*} datapointId the identifier of the datapoint to fetch
	 * @param {*} apiId the identifier as needed
	 * @param {boolean} [useCache=true] whether or not the cache should be used
	 * @returns 
	 */
	async getDatapoint(datapointId, apiId) {
		return this._fetchData(datapointId, apiId).then((data) => {
			var value = data[0].value;
			return this.dataTransformers[datapointId](value);
		});
	}

	/**
	 * Fetch many (historical) values for a particular datapoint, potentially from cached data
	 * 
	 * @param {*} datapointId the identifier of the datapoint to fetch
	 * @param {*} apiId the identifier as needed
	 * @param {boolean} [useCache=true] whether or not the cache should be used
	 * @returns 
	 */
	async getDatapoints(datapointId, apiId, useCache = true) {
		return this._fetchData(datapointId, apiId, useCache).then((data) => {
			//convert all the values (strings) into actual values using the transformer, but preserve the datestamps and qualifiers and stuff on them
			return data.map((dataitem) => {
				dataitem.value = this.dataTransformers[datapointId](dataitem.value)
				return dataitem
			});
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
