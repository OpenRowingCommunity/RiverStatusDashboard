//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		org.openweathermap.js created on 2018-11-01
//		refactored 2023-09-01 by Adrian Edwards

//	helper functions
function airTempFormatter(temp_i) {
	temp_i = Number.parseFloat(temp_i);
	//	Kelvin to Celsius
	var temp_f = (temp_i - 273.15);
	temp_f = temp_f.toFixed(1);	// single decimal place
	return ("" + temp_f /*+ " ˚C"*/);
}

//	1 mile = 1609.34 m; 1 h = 360 s
function airSpeedFormatter(speed_i) {
	var mps = Number.parseFloat(speed_i);
	var mph = (mps * (360/1609.34));
	var speed_f = mph.toFixed(1);
	return ("" + speed_f /*+ " mph"*/);
}

//	 E = [0,22]U[338,360]
//	NE = [23,67]
//	 N = [68,112]
//	NW = [113,157]
//	 W = [158,202]
//	SW = [203,247]
//	 S = [248,292]
//	SE = [293,337]
function airDirxnFormatter(dirxn_i) {
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
}


class NOAAWeather extends APIClient {

	constructor() {
		super('https://w1.weather.gov/xml/current_obs/display.php')
		this.id = APIClientIdentifier.NOAA_WATER
	}
	dataTransformers = {
		[DatapointIdentifier.AIR_DIRECTION]: airDirxnFormatter,
		[DatapointIdentifier.AIR_SPEED]: (v) => v,
		[DatapointIdentifier.AIR_TEMP]: (v) => v,

	}

	dataUnits = {
		[DatapointIdentifier.AIR_DIRECTION]: "", //cardinal directions are unitless
		[DatapointIdentifier.AIR_SPEED]: "mph",
		[DatapointIdentifier.AIR_TEMP]: "˚C",
	}


	async _getDatapoint(apiId, parameters = {}, path = "", start_datestamp = undefined, end_datestamp = undefined) {
		let params = {
			stid: apiId
		}

		//combine input parameters with defaults
		params = Object.assign({}, params, parameters);

		return super.request(path, params)
	}

	async getDatapoint(datapointId, apiId) {
		//TODO: check cache
		switch (datapointId) {
			case DatapointIdentifier.AIR_TEMP:
				return this._getDatapoint(apiId)
					.then(async (response) => {
						var data = await response.text()
						var apiData = $(data).find('temp_c').text();
						return this.dataTransformers[datapointId](apiData);
					});
			case DatapointIdentifier.AIR_SPEED:
				return this._getDatapoint(apiId)
					.then(async (response) => {
						var data = await response.text()
						var apiData = $(data).find('wind_mph').text();

						return this.dataTransformers[datapointId](apiData);
					});
			case DatapointIdentifier.AIR_DIRECTION:
				return this._getDatapoint(apiId)
					.then(async (response) => {
						var data = await response.text()
						var apiData = $(data).find('wind_degrees').text()

						return this.dataTransformers[datapointId](apiData);
					});
			default:
				console.log("datapoint " + datapointId + " not supported by client " + this.id);
		}
	}

	getUnits(datapointId) {
		return dataUnits[datapointId]
	}

	supportedDatapoints() {
		return this.dataTransformers.keys()
	}
}



var gov_weather_w1 = new NOAAWeather();