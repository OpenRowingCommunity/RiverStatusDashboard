export class APIClient {

	constructor(baseurl, id) {
		this.baseurl = baseurl
		this.id = id
	}

	async request(path, urlparameters) {
		let fullurl = new URL(this.baseurl + path)
		if (urlparameters != {}) {
			fullurl.search = new URLSearchParams(urlparameters)
		}

		return await fetch(fullurl);
	}

	//interface
	// async getDatapoint(datapointId, apiId, fetchHistorical = false);

	//TODO: supported datapoints list

}

/**
 * Represents a singular data point
 */
export class DataPoint {

	constructor(value, time, unit, sourceTypeId, notes="", generatedAt=undefined) {
		this.value = value
		this.time = time
		this.unit = unit
		this.sourceTypeId = sourceTypeId
		this.notes = notes
		this.generatedAt = generatedAt

	}

}