//		RiverStatusBoard: Information for Rowers and Paddlers
//		by Adrian Edwards <adrian@adriancedwards.com>
//		gov.airnow.js created on 2025-08-12

class AirNow extends APIClient {

	//  const parser = new DOMParser();
    //     const kmlDoc = parser.parseFromString(kmlString, "application/xml");

    //     const placemarks = kmlDoc.querySelectorAll("Placemark");
    //     const outputDiv = document.getElementById("output");

    //     placemarks.forEach(placemark => {
    //         const aqiElement = placemark.querySelector("aqi");
    //         const snippetElement = placemark.querySelector("Snippet");
    //         const descriptionElement = placemark.querySelector("description");
    //         const coordinatesElement = placemark.querySelector("coordinates");
    //         const styleUrlElement = placemark.querySelector("styleUrl");

    //         const aqi = aqiElement ? parseInt(aqiElement.textContent, 10) : null;
    //         const region = snippetElement ? snippetElement.textContent.trim() : "N/A";
    //         const coordinates = coordinatesElement ? coordinatesElement.textContent.trim() : "N/A";
    //         const styleUrl = styleUrlElement ? styleUrlElement.textContent.trim().replace('#', '') : "N/A"; // Remove '#' for easier styling

    //         let pm25Aqi = null;
    //         let pm25Category = null;
    //         let ozoneAqi = null;
    //         let ozoneCategory = null;


    //         // Determine class for overall AQI display
    //         let aqiClass = '';
    //         if (styleUrl) {
    //             // Assuming styleUrl directly corresponds to the category name (e.g., #Moderate -> aqi-moderate)
    //             aqiClass = `aqi-${styleUrl.toLowerCase()}`;
    //         } else if (aqi !== null) {
    //             // Fallback: assign based on numerical AQI if styleUrl is not present or reliable
    //             if (aqi <= 50) aqiClass = 'aqi-good';
    //             else if (aqi <= 100) aqiClass = 'aqi-moderate';
    //             else if (aqi <= 150) aqiClass = 'aqi-unhealthy-sensitive';
    //             else if (aqi <= 200) aqiClass = 'aqi-unhealthy';
    //             else if (aqi <= 300) aqiClass = 'aqi-very-unhealthy';
    //             else aqiClass = 'aqi-hazardous';
    //         }


    //         const placemarkHtml = `
    //             <div class="placemark-data">
    //                 <h3>${region}</h3>
    //                 <p><strong>Overall AQI:</strong> <span class="${aqiClass}">${aqi !== null ? aqi : 'N/A'} (${styleUrl})</span></p>
    //                 <p><strong>Coordinates:</strong> ${coordinates}</p>
    //                 <div class="aqi-summary">
    //                     ${pm25Aqi !== null ? `<p><strong>PM<sub>2.5</sub>:</strong> <span class="${pm25Category ? `aqi-${pm25Category.toLowerCase()}` : ''}">${pm25Aqi} (${pm25Category})</span></p>` : ''}
    //                     ${ozoneAqi !== null ? `<p><strong>Ozone:</strong> <span class="${ozoneCategory ? `aqi-${ozoneCategory.toLowerCase()}` : ''}">${ozoneAzone} (${ozoneCategory})</span></p>` : ''}
    //                 </div>
    //             </div>
    //         `;
    //         outputDiv.insertAdjacentHTML('beforeend', placemarkHtml);
    //     });

	constructor() {
		// s3-us-west-1.amazonaws.com//
		
		super('https://files.airnowtech.org/airnow/today/airnow_today.kml', APIClientIdentifier.AIRNOW)
	}

	dataTransformers = {
		// [DatapointIdentifier.WATER_FLOW]: (v) => v/1000, //convert from cfs to kcfs
		// [DatapointIdentifier.WATER_TEMP]: (v) => v,
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

			const pollutantAqis = {};

			// Parse the inner HTML of the CDATA description for individual pollutants
			// if (descriptionElement) {
			// 	const descriptionContent = descriptionElement.textContent;
			// 	const tempDiv = document.createElement('div');
			// 	tempDiv.innerHTML = descriptionContent;

			// 	const rows = tempDiv.querySelectorAll('table tr');
			// 	rows.forEach(row => {
			// 		const cells = row.querySelectorAll('td');
			// 		if (cells.length >= 3) {
			// 			const pollutantNameRaw = cells[1].textContent.trim();
			// 			const aqiText = cells[2].textContent.trim();

			// 			const match = aqiText.match(/(\w+)\s+(\d+)/);
			// 			if (match) {
			// 				const category = match[1];
			// 				const value = parseInt(match[2], 10);

			// 				let pollutantKey = '';
			// 				if (pollutantNameRaw.includes('PM2.5')) {
			// 					pollutantKey = 'pm25';
			// 				} else if (pollutantNameRaw.includes('Ozone')) {
			// 					pollutantKey = 'ozone';
			// 				}
			// 				// Add more else if for other pollutants if they appear (e.g., PM10, CO)

			// 				if (pollutantKey) {
			// 					pollutantAqis[pollutantKey] = {
			// 						value: value,
			// 						category: category
			// 					};
			// 				}
			// 			}
			// 		}
			// 	});
			// }

			parsedData.push({
				region: region,
				overallAqi: aqi,
				overallAqiCategory: styleUrl, // From styleUrl, e.g., "Moderate"
				coordinates: coordinates, // [longitude, latitude, altitude]
				// pollutantAqis: pollutantAqis, // e.g., { pm25: {value: 51, category: "Moderate"}, ozone: {value: 50, category: "Good"} }
				// You could also store the raw description HTML if needed:
				// rawDescriptionHtml: descriptionElement ? descriptionElement.textContent : null
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