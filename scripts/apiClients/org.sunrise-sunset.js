//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		org.sunrise-sunset.js created on 2017-06-26

//	requirejs(['moment']); ?		//	<- expects moment to be available in the global ns

var org_sunrise_sunset = {
	
	cache: {
		data: null,
		timestamp: null,
		agelimit: null
	},
	
	api: {
		url: 'https://api.sunrise-sunset.org/json',
		params: {
			lat: config.boathouseLat,
			lng: config.boathouseLong,
			date: moment().format('YYYY-MM-DD'),
			formatted: 0
		}
	},
	
	//	helper functions
	timeFormatter: function (time_i) {
		var time_f = time_i;
		if (moment != null) {
			time_f = moment(time_i);
			// time_f = time_f.format("h:mm a");
		}
		return time_f;
	},
	
	//	api functions
	getSunrise: function (setterFunc) {
		//	1: check if we have data already
		if (org_sunrise_sunset.cache.data != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (now - cache.timestamp) < agelimit ){
				let value = cache.data.THEVALUE;			//TODO: replace with real value
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = org_sunrise_sunset;
		
		$.ajax({
			url: asyncContext.api.url, 
			data: asyncContext.api.params, 
			datatype: 'json',
			success: function (data, textStatus, jqXHR) {
				var apiData = data.results.sunrise;
				apiData = asyncContext.timeFormatter(apiData);
				// TODO: update cache
				setterFunc(apiData);
			}
		});
	},
	
	getSunset: function (setterFunc) {
		//	1: check if we have data already
		if (org_sunrise_sunset.cache.data != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (now - cache.timestamp) < agelimit ){
				let value = cache.data.THEVALUE;			//TODO: replace with real value
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = org_sunrise_sunset;
		
		$.ajax({
			url: asyncContext.api.url, 
			data: asyncContext.api.params, 
			datatype: 'json',
			success: function (data, textStatus, jqXHR) {
				var apiData = data.results.sunset;
				apiData = asyncContext.timeFormatter(apiData);
				// TODO: update cache
				setterFunc(apiData);
			}
		});
	}
	
};

// EOF
