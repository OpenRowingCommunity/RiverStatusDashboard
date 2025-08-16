/* This file conteins independent helper functions
 * Most of these are used for formatting data prior to display
 */


export function airTempFormatter(temp_i) {
	temp_i = Number.parseFloat(temp_i);
	//	Kelvin to Celsius
	var temp_f = (temp_i - 273.15);
	temp_f = temp_f.toFixed(1);	// single decimal place
	return ("" + temp_f /*+ " ˚C"*/);
}

export function toFahrenheit(temp) {
	return ( (temp!=null) ? ((temp * (9/5)) + 32) : null );
};

export function toCelsius(temp) {
	return ( (temp!=null) ? ((temp - 32) * (5/9)) : null );
};

export function swapTempUnit(temp) {
	if (temp.includes("C")) {
		return temp.replace("C", "F")
	} else {
		return temp.replace("F", "C")
	}
}

//	1 mile = 1609.34 m; 1 h = 360 s
export function toMPH(meters_per_second) {
	var mps = Number.parseFloat(meters_per_second);
	var mph = (mps * (360/1609.34));
	return mph
}

function airSpeedFormatter(mph){
	var speed_f = mph.toFixed(1);
	return ("" + speed_f /*+ " mph"*/);
}

/**
 * Converts a number of degrees into a string representing the cardinal direction of the wind
 *
 *  E = [0,22]U[338,360]
 * NE = [23,67]
 *  N = [68,112]
 * NW = [113,157]
 *  W = [158,202]
 * SW = [203,247]
 *  S = [248,292]
 * 
 * @param {*} dirxn_i the direction in degrees
 * @param {boolean} [force_shorthand=false] force the use of shortened directions (i.e. N instead of North) in all results.
 * @returns a string representing the cardinal direction
 */
export function airDirxnFormatter(dirxn_i, force_shorthand=false) {
	var theta = Number.parseInt(dirxn_i);
	var dir;
	if ((0 <= theta && theta <= 22) || (338 <= theta && theta <= 360)) {
		dir = force_shorthand? "E" : "East";
	} else if (23 <= theta && theta <= 67) {
		dir = "NE";
	} else if (68 <= theta && theta <= 112) {
		dir = force_shorthand? "N" : "North";
	} else if (113 <= theta && theta <= 157) {
		dir = "NW";
	} else if (158 <= theta && theta <= 202) {
		dir = force_shorthand? "W" : "West";
	} else if (203 <= theta && theta <= 247) {
		dir = "SW";
	} else if (248 <= theta && theta <= 292) {
		dir = force_shorthand? "S" : "South";
	} else if (293 <= theta && theta <= 337) {
		dir = "SE";
	} else {
		dir = "error[theta outside 0-360˚]";
	}
	return dir;
}

export function timeFormatter(time_i) {
	var time_f = time_i;
	if (moment != null) {
		time_f = moment(time_i);
		// time_f = time_f.format("h:mm a");
	}
	return time_f;
}

let airqualThresholds = [
	{
		min: 0,
		max: 50,
		name: "Good",
		color: '#00E400'
	},
	{
		min: 51,
		max: 100,
		name: "Moderate",
		color: '#ffff00'
	},
	{
		min: 101,
		max: 150,
		name: "Unhealthy for Sensitive Groups (USG)",
		color: '#ff7e00'
	},
	{
		min: 151,
		max: 200,
		name: "Unhealthy",
		color: '#ff0000'
	},
	{
		min: 201,
		max: 300,
		name: "Very Unhealthy",
		color: '#8F3F97'
	},
	{
		min: 301,
		max: undefined,
		name: "Hazardous",
		color: '#7E0023'
	}
];

export function colorForAirQual(aqi) {

	let failureColor = '#000000';
	
	// ensure aqi is a valid number
	if(isNaN(aqi)){
		console.log("provided AQI value is not a number :" + aqi);
		return failureColor;
	}

	if (aqi < 0) {
		console.log("provided AQI value is less than 0 :" + aqi);
		return failureColor;
	}

	for (const aqiZone of airqualThresholds) {
		if (aqiZone.max != undefined && aqi > aqiZone.max) {
			//we are above this zone. next one
			continue
		}
		return aqiZone.color;
	}

	
}


export function validateNumber(value){
	return typeof(value) !== 'undefined' && !isNaN(value) && value !== "";
}