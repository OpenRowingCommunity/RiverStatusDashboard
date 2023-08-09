//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		gov.weather.js created on 2017-06-26


var gov_weather_water = {
	
	cache: {
		data: null,
		timestamp: null,
		agelimit: null
	},
	
	api: {
		url: 'https://water.weather.gov/ahps2/hydrograph_to_xml.php',
		params: {
			gage: config.noaaGageId,
			output: 'xml'		// switch to JSON? -- unsupported yet
		}
	},
	
	// helper functions
	unitsFormatter: function (measure, units_i) {
		return units_i;
	},
	
	valueFormatter: function (measure, value_i) {
		return value_i;
	},
	
	// api functions
	getWaterFlow: function (setterFunc) {
		//	1: check if we have data already
		if (gov_weather_water.cache.data != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (now - cache.timestamp) < agelimit ){
				let value = cache.data.THEVALUE;			//TODO: replace with real value
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = gov_weather_water;
		
		$.ajax({
			url: asyncContext.api.url, 
			data: asyncContext.api.params, 
			datatype: asyncContext.api.params.format,
			success: function (data, textStatus, jqXHR) {
				
				// get from data -- XPaths?
				var datum = $(data).find('observed > datum:first');
				var flowUnits = $(datum).find('secondary').attr('units');
				var flowValue = $(datum).find('secondary').text();
				flowUnits = asyncContext.unitsFormatter('flow', flowUnits);
				flowValue = asyncContext.valueFormatter('flow', flowValue);
				
				let apiData = "" + flowValue /*+ " " + flowUnits*/;
				
				// TODO: update the cached data
				setterFunc(apiData);
			}//end-success
		});//end-$.ajax
		
	},//end-getWaterFlow
	
	getWaterLevel: function (setterFunc) {
		
		//	1: check if we have data already
		if (gov_weather_water.cache.data != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (now - cache.timestamp) < agelimit ){
				let value = cache.data.THEVALUE;			//TODO: replace with real value
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = gov_weather_water;
		
		$.ajax({
			url: asyncContext.api.url, 
			data: asyncContext.api.params, 
			datatype: asyncContext.api.params.format,
			success: function (data, textStatus, jqXHR) {
				
				// get from data
				var datum = $(data).find('observed > datum:first');
				var floodUnits = $(datum).find('primary').attr('units');
				var floodValue = $(datum).find('primary').text();
				floodUnits = asyncContext.unitsFormatter('level', floodUnits);
				floodValue = asyncContext.valueFormatter('level', floodValue);
				
				let apiData = "" + floodValue /*+ " " + floodUnits*/;
				
				// TODO: update the cached data
				setterFunc(apiData);
			}//end-success
		});//end-$.ajax
		
	},//end-getWaterLevel
	
};

// EOF
