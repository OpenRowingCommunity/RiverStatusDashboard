//	
//		TRRA Dashboard
//		by Maxwell Garber <max.garber+dev@gmail.com>
//		graph.js
//

import { config } from './config.js';
import { apiConcierge } from './apiConcierge.js';
import { APIClientIdentifier, DatapointIdentifier } from './constants.js';
import { toFahrenheit } from './helpers.js';

//	Global Variables
var abscissa = { observed: [], forecast: [] };
var moments = { observed: [], forecast: [] };
var ordinates = {
	observed: { flow: [], flood: [], temp: [] },
	forecast: { flow: [], flood: [], temp: [] }
};
var units = { flow: 'kcfs', flood: 'ft', temp: '˚C' };
var graphCanvas = null;
var graphSettings = {};
var theGraph;


let selectors = {
	graphCanvas: '#graphCanvas'
};

var tempReqFormat = "YYYY-MM-DDTHH:mm-0000";



let floodSourceURI = "https://api.water.noaa.gov/nwps/v1/gauges/"+config.getDataSourceDetailsByType(APIClientIdentifier.NOAA_WATER)[0].id;
let floodParameters = {};

let temperatureSourceURI = "https://waterservices.usgs.gov/nwis/iv/";
let temperatureParameters = {
	format: 'json',
	sites: config.getDataSourceDetails(APIClientIdentifier.USGS, DatapointIdentifier.WATER_TEMP)[0].id,
	startDT: '',		// literal example '2017-04-12T15:00-0000'	@NOTE these get overwritten in flow/flood callback
	endDT: '',			// literal example '2017-04-14T01:30-0000'
	parameterCd: '00010',
	siteStatus: 'all'
};


let flowParameters = {
	startDT: '',			// need to restore for timeseries fetch
	endDT: ''
};

// Formatters/Utilities
var tickFormatter = function (value, index, values, type) {	
	if (type == "flow") {
		console.log("got value: "+value);
		return value.toString();
	}
	if (type == "temp") {
		return value.toString();
	}	
}

//	Graph Functions
export var setupGraphStructures = function () {
	// axes & scales
	
	// dataset wrapping
	
	// options, canvas, & settings
	graphCanvas = $(selectors.graphCanvas).get(0);
	graphSettings = {
		type: "line",
		data: {
			labels: abscissa.observed,
			datasets: [
				{
					label: "Flow (kcfs)",
					borderColor: config.plotColors.flow,
					backgroundColor: config.plotColors.flow,
					fill: false,
					yAxisID: "yAxis_flow",
					data: ordinates.observed.flow
				},
				{
					label: "Flood Stage (ft)",
					borderColor: config.plotColors.flood,
					backgroundColor: config.plotColors.flood,
					fill: false,
					yAxisID: "yAxis_flood",
					data: ordinates.observed.flood
				},
				{
					label: "Water Temperature (˚C)",
					borderColor: config.plotColors.temperature,
					backgroundColor: config.plotColors.temperature,
					fill: false,
					yAxisID: "yAxis_temp",
					data: ordinates.observed.temp
				}
			]
		},
		options: {
			scales: {
				x: {
					type: "time",		// can we pass the moment objects directly?
					display: true,
					//...............
					position: "bottom",
					grid: { 
						display: true,
						color: '#ffffff',
						lineWidth: 0.1,
						// borderDash: [5,2],
					},
					time:  {
						unit: 'hour',
						displayFormats: {
							month: 'MM',
							day: 'DD',
							hour: 'ddd ha',
							minute: 'mm'
						},
						stepSize: 10,
						bounds: 'data',
						ticks: 'data'
					}
				},
				yAxis_flow: {
					type: "linear",
					position: "right",
					display: true,
					grid: { display: false },
					min: 0,
					max: 10,
					title: {
						display: true,
						text: "Flow Rate (kcfs)",
						color: config.plotColors.flow,
						// fontSize: 14
					},
				},
				yAxis_temp: {
					type: "linear",
					position: "left",
					grid: { display: false },
					min: 0,
					max: 30,
					stepSize: 10,
					// ticks: {
						// callback: function (label, index, labels) {
						// 		return label + "˚C | " + toFahrenheit(Number.parseFloat(label)) + "˚F";
						// }
					// },
					title: {
						display: true,
						text: "Water Temperature (˚C)",
						color: config.plotColors.temperature,
						// fontSize: 14
					},
					color: config.plotColors.temp
				}, 
				yAxis_flood: {
					type: "linear",
					position: "left",
					grid: { display: false },
					min: 8,
					max: 16,
					title: {
						display: true,
						text: "Flood Stage (ft)",
						color: config.plotColors.flood,
						// fontSize: 14
					}
				}
			},
			plugins: {
				legend: {
					position: "bottom",
					labels: {
						fontColor: 'white'
					}
				},
			},
			hidden: false,
			maintainAspectRatio: false
		}
	};
};

var renderGraph = function () {
	Chart.defaults.color = 'white';
	Chart.defaults.elements.point.radius = 1;
	Chart.defaults.elements.line.borderWidth = 3;
	Chart.defaults.elements.line.tension = 0.8;
	Chart.defaults.elements.line.fill = true;

	if (theGraph == null) {
		theGraph = new Chart(graphCanvas, graphSettings);
	}
};


// Data Parsing Functions
var parseFloodData = function (data) {
	// parse and extract most recent data first
	var latestObservedDatum = $(data).find('observed > datum:first');
	var latestObserved = {
		floodStageMeasurement: $(latestObservedDatum).find('primary').text(),
		floodStageUnits: $(latestObservedDatum).find('primary').attr('units'),
	};
	// get time-series and forecasted data
	var observedData = $(data).find('site > observed > datum');
	var observedDataN = observedData.length;
	var forecastData = $(data).find('site > forecast > datum');
	var forecastDataN = forecastData.length;
	for(var i = 0; i < observedDataN; i++) {
		var datum = $(observedData).get(i);
		var datetime = $(datum).children('valid').text();
		//datetime = datetime.substr(0,16);
		var flood = $(datum).children('primary').text();
		var aMoment = moment(datetime);
		moments.observed[i] = aMoment;
		abscissa.observed[i] = aMoment;
		ordinates.observed.flood[i] = Number.parseFloat(flood);
	}
	moments.forecast = [];
	abscissa.forecast = [];
	for(var i = 0; i < forecastDataN; i++) {
		var datum = $(forecastData).get(i);
		var datetime = $(datum).children('valid').text();
		//datetime = datetime.substr(0,16);
		var flood = $(datum).children('primary').text();
		var aMoment = moment(datetime);
		moments.forecast.push(aMoment);
		abscissa.forecast.push(aMoment);
		ordinates.forecast.flood[i] = Number.parseFloat(flood);
	}
};


// Data Parsing Functions
var parseFlowData = function (data) {
	let timeseriesdata = data;//timeseries.values[0].value
	// parse and extract most recent data first
	var latestObservedDatum = timeseriesdata[0];
	
	// var units = timeseries.variable.unit.unitCode;
	units = "kcfs"
	
	// get time-series and forecasted data
	var observedData = timeseriesdata;
	var observedDataN = observedData.length;
	for(var i = 0; i < observedDataN; i++) {
		var datum = observedData[i];
		var datetime = datum['dateTime'];
		//datetime = datetime.substr(0,16);
		var flow = Number.parseInt(datum['value'])/1000;
		var aMoment = moment(datetime);
		moments.observed[i] = aMoment;
		abscissa.observed[i] = aMoment;
		ordinates.observed.flow[i] = Number.parseFloat(flow);
	}
	var obsmin = moment.min(moments.observed);
	var obsmax = moment.max(moments.observed);
};

var parseTemperatureData = function (data) {
	var tempC = $(data.documentElement).children().find('wml2\\:value:first').text();
	var tempF = toFahrenheit(tempC);
	var latestObserved = {
		celsius: tempC,
		fahrenheit: tempF
	}

	// extract timeseries data
	var observedData = $(data.documentElement).children('wml2\\:observationMember').find('wml2\\:point')
	var observedDataN = observedData.length;
	for(var i = 0; i < observedDataN; i++) {
		var datum = $(observedData).get(i);
		var datetime = $(datum).find('wml2\\:time').text();
		var temp = $(datum).find('wml2\\:value').text();
		ordinates.observed.temp[i] = Number.parseFloat(temp);
	}
};

export var populateDataSets = async function () {

	// get a date range for the last 7 days
	let timeWindowParameters = {
		startDT: moment().subtract(7, 'days').format(tempReqFormat),
		endDT: moment().format(tempReqFormat)
	}
	$.ajax({
		url: floodSourceURI,
		data: Object.assign({}, floodParameters, timeWindowParameters),
		datatype: 'xml',
		success: async function (data) {
			parseFloodData(data);
			// hard-chain start
			$.ajax({
				url: temperatureSourceURI,
				data: Object.assign({}, temperatureParameters, timeWindowParameters),
				datatype: 'xml',
				success: async function (data) {
					parseTemperatureData(data);
				
					// hard-chain start
					apiConcierge.getValuesAsync(DatapointIdentifier.WATER_FLOW, timeWindowParameters).then(
						(data) => {
							parseFlowData(data);
							renderGraph();
						}
					)
					// hard-chain end
				}
			});
			// hard-chain end
		}
	});

	// here: intervene to remove all data in flow and flood from before first temperature reading
	
	// await renderGraph();
};