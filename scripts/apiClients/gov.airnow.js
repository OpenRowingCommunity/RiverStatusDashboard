//		RiverStatusBoard: Information for Rowers and Paddlers
//		by Adrian Edwards <adrian@adriancedwards.com>
//		gov.airnow.js created on 2025-08-12

class AirNow extends APIClient {

	constructor() {
		super('https://files.airnowtech.org/airnow/today/airnow_today.kml', APIClientIdentifier.AIRNOW)
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
	 * @param {*} parameters 
	 * @returns 
	 */
	async _fetchData(datapointId, parameters = {}) {
		let query;

		switch (datapointId) {
			case DatapointIdentifier.AIR_QUALITY:
			
				break;
			default:
				console.error("datapoint " + datapointId + " not supported by client " + this.id);
				return Promise.reject("datapoint " + datapointId + " not supported by client " + this.id)
		}

		// Process the KML data received
		return this._queryData().then(async (response) => {
			let data = await response.text();
			return this._parseKmlToJson(data);
		});
	}
	
	/**
	 * Fetch a single datapoint, potentially from cached data
	 * 
	 * @param {*} datapointId the identifier of the datapoint to fetch
	 * @param {*} regionName the name of the region to use
	 * @returns 
	 */
	async getDatapoint(datapointId, regionName) {
		return this._fetchData(datapointId).then((data) => {
			var value = data.filter((value) => value.region == regionName)[0];
			console.log(value);
			return value.overallAqi;
		});
	}

	_parseKmlToJson(kmlString){
		const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlString, "application/xml");

        const placemarks = kmlDoc.querySelectorAll("Placemark");

		let parsedData = [];

        const outputDiv = document.getElementById("output");
		placemarks.forEach(placemark => {
			const aqiElement = placemark.querySelector("aqi");
			const snippetElement = placemark.querySelector("Snippet");
			const descriptionElement = placemark.querySelector("description");
			const coordinatesElement = placemark.querySelector("coordinates");
			const styleUrlElement = placemark.querySelector("styleUrl");

			const aqi = aqiElement ? parseInt(aqiElement.textContent, 10) : null;
			const region = snippetElement ? snippetElement.textContent.trim() : "N/A";
			const coordinates = coordinatesElement ? coordinatesElement.textContent.trim().split(',').map(Number) : null;
			const styleUrl = styleUrlElement ? styleUrlElement.textContent.trim().replace('#', '') : null;


			parsedData.push({
				region: region,
				overallAqi: aqi,
				overallAqiCategory: styleUrl, // From styleUrl, e.g., "Moderate"
				coordinates: coordinates, // [longitude, latitude, altitude]
			});
		});

		return parsedData;
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
		return this._fetchData(datapointId, apiId, parameters).then((data) => {
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

var gov_airnow = new AirNow();