
const DatapointIdentifier = Object.freeze({
    WATER_FLOW:		Symbol("waterflow"),
	WATER_TEMP:		Symbol("watertemp"),
	WATER_LEVEL:	Symbol("waterlevel"),
	AIR_TEMP:		Symbol("airtemp"),
	AIR_SPEED:		Symbol("airspeed"),
	AIR_DIRECTION:	Symbol("airdirection"),
	AIR_QUALITY:	Symbol("airquality")
});

const APIClientIdentifier = Object.freeze({
	NOAA_WATER:			Symbol("water.weather.gov"),
	EPA_AIRNOW:			Symbol("airnow.epa.gov"),
	NOAA_W1:			Symbol("w1.weather.gov"),
	USGS:				Symbol("usgs.gov"),
	SUNRISE_SUNSET_ORG:	Symbol("sunrise-sunset.org")
});