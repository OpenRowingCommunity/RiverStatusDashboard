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
