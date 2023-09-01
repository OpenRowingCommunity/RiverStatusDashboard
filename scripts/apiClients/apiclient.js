class APIClient {

	constructor(baseurl) {
		this.baseurl = baseurl
	}

	async request(path, urlparameters) {
		let fullurl = new URL(this.baseurl + path)
		if (urlparameters != {}) {
			fullurl.search = new URLSearchParams(urlparameters)
		}

		return await fetch(url);
	}

	//interface
	// async getDatapoint(datapointId, apiId, fetchHistorical = false);

	//TODO: supported datapoints list

}
