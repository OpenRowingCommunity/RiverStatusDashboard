//		RiverStatusBoard: Information for Rowers and Paddlers
//		by Adrian Edwards <adrian@adriancedwards.com>
//		gov.airnow.js created on 2025-08-12

class AirNow extends APIClient {

	constructor() {
		super('https://airnowgovapi.com/andata/ReportingAreas', APIClientIdentifier.AIRNOW)
	}

	dataUnits = {
		[DatapointIdentifier.AIR_QUALITY]: 'AQI'
	}

	/** A very low level internal helper that assembles parameters and makes a query to the API
	 * 
	 * @param {*} path 
	 * @param {*} parameters 
	 * @returns 
	 */
	async _queryData(path = "", parameters = {}) {
		return super.request(path, parameters)
	}

	/** An internal helper that sets up and performs queries for particular data and does some extraction of that data from the result 
	 * 
	 * @param {*} datapointId 
	 * @param {*} apiId
	 * @param {*} parameters 
	 * @returns 
	 */
	async _fetchData(datapointId, apiId, parameters = {}) {
		let query;

		switch (datapointId) {
			case DatapointIdentifier.AIR_QUALITY:
			
				break;
			default:
				console.error("datapoint " + datapointId + " not supported by client " + this.id);
				return Promise.reject("datapoint " + datapointId + " not supported by client " + this.id)
		}

		// Process the KML data received
		return this._queryData(`/${apiId}.json`).then(async (response) => {
			let data = await response.json();
			data['hourlyReadings'] = this._zipHourlyData(data);
			delete data['aqi'];
			delete data['param'];
			delete data['utcDateTimes'];
			
			return data;
		});
	}
	
	/**
	 * Fetch a single datapoint, potentially from cached data
	 * 
	 * @param {*} datapointId the identifier of the datapoint to fetch
	 * @param {*} apiId the name of the region to use
	 * @returns 
	 */
	async getDatapoint(datapointId, apiId) {
		return this._fetchData(datapointId, apiId).then((data) => data.hourlyReadings[data.hourlyReadings.length-1].aqi);
	}

	_zipHourlyData(data) {
		
		// Determine the length of the shortest array to prevent errors
		const minLength = Math.min(
			data.aqi.length,
			data.param.length,
			data.utcDateTimes.length
		);
		
		let hourlyReadings = [];
		for (let i = 0; i < minLength; i++) {
			hourlyReadings.push({
				aqi: data.aqi[i],
				param: data.param[i],
				dateTimeUTC: data.utcDateTimes[i],
			});
		}

		return hourlyReadings;
	}

	/**
	 * Fetch many (historical) values for a particular datapoint, potentially from cached data
	 * 
	 * @param {*} datapointId the identifier of the datapoint to fetch
	 * @param {*} apiId the identifier as needed
	 * @param {boolean} [useCache=true] whether or not the cache should be used
	 * @returns 
	 */
	async getDatapoints(datapointId, apiId, parameters = {}, useCache = true, ) {
		return this._fetchData(datapointId, apiId, parameters)
	}

	getUnits(datapointId) {
		if (! this.supportedDatapoints().includes(datapointId)){
			console.error(`${datapointId} is not supported for data source ${this.id}`)
			return "Unsupported"
		}
		return this.dataUnits[datapointId]
	}

	supportedDatapoints() {
		return Object.keys(this.dataUnits)
	}
}

var gov_airnow = new AirNow();