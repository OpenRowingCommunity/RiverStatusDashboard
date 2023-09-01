//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		org.openweathermap.js created on 2018-11-01

var gov_weather_w1 = {
	
	cache: {
		data: null,
		timestamp: null,
		agelimit: null
	},
	
	api: {
		url: 'https://w1.weather.gov/xml/current_obs/display.php',
		params: {
			stid: config.getDataSourceDetailsByType(APIClientIdentifier.NOAA_W1)[0].id,
		}
	},
	
	//	helper functions
	airTempFormatter: function (temp_i) {
		temp_i = Number.parseFloat(temp_i);
		//	Kelvin to Celsius
		var temp_f = (temp_i - 273.15);
		temp_f = temp_f.toFixed(1);	// single decimal place
		return ("" + temp_f /*+ " ˚C"*/);
	},
	
	//	1 mile = 1609.34 m; 1 h = 360 s
	airSpeedFormatter: function (speed_i) {
		var mps = Number.parseFloat(speed_i);
		var mph = (mps * (360/1609.34));
		var speed_f = mph.toFixed(1);
		return ("" + speed_f /*+ " mph"*/);
	},
	
	//	 E = [0,22]U[338,360]
	//	NE = [23,67]
	//	 N = [68,112]
	//	NW = [113,157]
	//	 W = [158,202]
	//	SW = [203,247]
	//	 S = [248,292]
	//	SE = [293,337]
	airDirxnFormatter: function (dirxn_i) {
		var theta = Number.parseInt(dirxn_i);
		var dir;
		if ((0 <= theta && theta <= 22) || (338 <= theta && theta <= 360)) {
			dir = "East";
		} else if (23 <= theta && theta <= 67) {
			dir = "NE";
		} else if (68 <= theta && theta <= 112) {
			dir = "North";
		} else if (113 <= theta && theta <= 157) {
			dir = "NW";
		} else if (158 <= theta && theta <= 202) {
			dir = "West";
		} else if (203 <= theta && theta <= 247) {
			dir = "SW";
		} else if (248 <= theta && theta <= 292) {
			dir = "South";
		} else if (293 <= theta && theta <= 337) {
			dir = "SE";
		} else {
			dir = "error[theta outside 0-360˚]";
		}
		return dir;
	},
	
	//	api functions
	getAirTemp: function (setterFunc) {
		//	1: check if we have data already
		if (gov_weather_w1.cache.data != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (now - cache.timestamp) < agelimit ){
				let value = cache.data.THEVALUE;			//TODO: replace with real value
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = gov_weather_w1;
		
		$.ajax({
			url: asyncContext.api.url, 
			data: asyncContext.api.params, 
			datatype: 'xml',
			success: function (data, textStatus, jqXHR) {
				var apiData = $(data).find('temp_c').text();
				//apiData = asyncContext.airTempFormatter(apiData);
				setterFunc(apiData);
			}
		});
	},
	
	getAirSpeed: function (setterFunc) {
		//	1: check if we have data already
		if (gov_weather_w1.cache.data != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (now - cache.timestamp) < agelimit ){
				let value = cache.data.THEVALUE;			//TODO: replace with real value
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = gov_weather_w1;
		
		$.ajax({
			url: asyncContext.api.url, 
			data: asyncContext.api.params, 
			datatype: 'xml',
			success: function (data, textStatus, jqXHR) {
				var apiData = $(data).find('wind_mph').text();
				// apiData = asyncContext.airSpeedFormatter(apiData);
				// TODO: update cache
				setterFunc(apiData);
			}
		});
	},
	
	getAirDirxn: function (setterFunc) {
		//	1: check if we have data already
		if (gov_weather_w1.cache.data != null) {
			//	2: if the timestamp is acceptably recent, use it
			if ( (now - cache.timestamp) < agelimit ){
				let value = cache.data.THEVALUE;			//TODO: replace with real value
				setterFunc(value);
				return;
			}
		}
		
		let asyncContext = gov_weather_w1;
		
		$.ajax({
			url: asyncContext.api.url, 
			data: asyncContext.api.params, 
			datatype: 'xml',
			success: function (data, textStatus, jqXHR) {
				var apiData = $(data).find('wind_degrees').text()
				apiData = asyncContext.airDirxnFormatter(apiData);
				// TODO: update cache
				setterFunc(apiData);
			}
		});
	}
	
};