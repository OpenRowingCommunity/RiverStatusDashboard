//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.usgs.js created on 2017-06-26


var gov_usgs = {
	
	cache: {
		data: {
			temperature: null,
			flow: null
		},
		timestamp: {
			temperature: null,
			flow: null
		},
		agelimit: 60000
	},
	
	api: {
		url: 'https://waterservices.usgs.gov/nwis/iv',
		params: {
			format: 'json',			// 'waterml,2.0' is old style
			sites: config.filterDataSources("usgs", "watertemp")[0].id,
			parameterCd: '00010',
			siteStatus: 'all'/*,
			startDT: '',			// need to restore for timeseries fetch
			endDT: '' */
		}
	},
	
	//	helper functions
	tempUnitsFormatter: function (unit_i) {
		return "˚C";
	},
	
	tempValueFormatter: function (value_i) {
		return value_i;
	},

	flowUnitsFormatter: function (unit_i) {
		return "kcfs";
	},
	
	flowValueFormatter: function (value_i) {
		return value_i/1000;
	},
	
	//	api functions
	getWaterTemp: function (setterFunc) {
		//	1: check if we have data already
		if (gov_usgs.cache.data.temperature != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (new Date().getTime() - gov_usgs.cache.timestamp.temperature) < cache.agelimit ){
				let value = gov_usgs.cache.data.temperature;
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = gov_usgs;
		
		$.ajax({
			url: asyncContext.api.url, 
			data: asyncContext.api.params, 
			datatype: asyncContext.api.params.format,
			success: function (data, textStatus, jqXHR) {
				var value = data.value.timeSeries[0].values[0].value[0].value;
				value = asyncContext.tempValueFormatter(value);
				
				var units = data.value.timeSeries[0].variable.unit.unitCode;
				units = asyncContext.tempUnitsFormatter(units);
				
				let apiData = "" + value /*+ " " + units*/;
				
				// update the cached data
				gov_usgs.cache.data.temperature = apiData
				gov_usgs.cache.timestamp.temperature = new Date().getTime()

				setterFunc(apiData);
			}//end-success
		});//end-$.ajax
	},//end-getWaterTemp
	

	//	api functions
	getWaterFlow: function (setterFunc) {
		//	1: check if we have data already
		if (gov_usgs.cache.data.flow != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (new Date().getTime() - gov_usgs.cache.timestamp.flow) < gov_usgs.cache.agelimit ){
				let value = cache.data.flow;
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = gov_usgs;

		let params = Object.assign({},asyncContext.api.params);

		//TODO: fix this, its a bit of a gross hack. need to OOP-ify the APIs
		params.parameterCd = '00060'
		params.sites = config.filterDataSources("usgs", "waterflow")[0].id
		
		$.ajax({
			url: asyncContext.api.url, 
			data: params, 
			datatype: params.format,
			success: function (data, textStatus, jqXHR) {
				var value = data.value.timeSeries[0].values[0].value[0].value;
				value = asyncContext.flowValueFormatter(value);
				
				var units = data.value.timeSeries[0].variable.unit.unitCode;
				units = asyncContext.flowUnitsFormatter(units);
				
				let apiData = "" + value /*+ " " + units*/;
				
				// update the cached data
				gov_usgs.cache.data.flow = apiData
				gov_usgs.cache.timestamp.flow = new Date().getTime()
				setterFunc(apiData);
			}//end-success
		});//end-$.ajax
	}//end-getWaterFlow
};

// EOF
