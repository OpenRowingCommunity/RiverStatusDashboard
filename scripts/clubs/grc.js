import { RiverStatusConfig, Restriction, SafetyMatrix, SafetyZone, LessThan, AtLeast, Between } from "~/safetyTypes";

import { DatapointIdentifier } from "~/constants";
import { toCelsius } from "~/helpers";
import { APIClientIdentifier } from "~/constants";

export let grcconfig = new RiverStatusConfig({
	riverName: "Genesee",
	clubFullName: "GRC Rowing",
	clubAcronym: "GRC",
	boathouseLat: 43.122698,
	boathouseLong: -77.637342,
	safetyMatrix: new SafetyMatrix({
		version: "GRC Safety Matrix (updated March 17th, 2026)",
		safetyZones: [
			new SafetyZone({
				label: '1',
				color: '#00c020',
				conditions: [
					new LessThan(DatapointIdentifier.WATER_FLOW, 3, "kcfs"),
					new AtLeast(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F"),
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "All Boats"
					}),
					new Restriction({
						category: 'Racing',
						description: "Racing Allowed"
					}),
					new Restriction({
						category: 'Launches',
						description: "Shells must be accompanied by one launch"
					}),
					
					new Restriction({
						category: 'Safety Gear',
						description: "<p><b>Coxswains</b>: PFD not required</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>No restrictions</p>"
					})
				]
			}),
			new SafetyZone({
				label: '2',
				color: '#40fe00',
				conditions: [
					new Between(DatapointIdentifier.WATER_FLOW, 3, 5, "kcfs"),
					new AtLeast(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F"),
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "All Boats"
					}),
					new Restriction({
						category: 'Racing',
						description: "Racing Allowed"
					}),
					new Restriction({
						category: 'Launches',
						description: "1 launch per 3 shells"
					}),
					
					new Restriction({
						category: 'Safety Gear',
						description: "<p><b>Coxswains</b>: PFD not required</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>No Learn to Row class</p>"
					})
				]
			}),
			new SafetyZone({
				label: '3',
				color: '#ffff00',
				conditions: [
					new Between(DatapointIdentifier.WATER_FLOW, 5, 7, "kcfs"),
					new Between(DatapointIdentifier.WATER_TEMP, toCelsius(40), toCelsius(50), "F"),
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "8+, 4x, 4+, 2x",
						conditions: [
							new LessThan(DatapointIdentifier.WATER_FLOW, 5, "kcfs")
						]
					}),
					new Restriction({
						category: 'Shell Types',
						description: "8+, 4x, 4+",
						conditions: [
							new AtLeast(DatapointIdentifier.WATER_FLOW, 5, "kcfs")
						]
					}),
					new Restriction({
						category: 'Racing',
						description: "Racing Allowed"
					}),
					new Restriction({
						category: 'Launches',
						description: "1 launch per 2 shells"
					}),
					
					new Restriction({
						category: 'Safety Gear',
						description: "<p><b>Coxswains</b>: PFD Required</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>No Learn to Rows</p>"
					})
				]
			}),
			new SafetyZone({
				label: '4',
				color: '#ffa800',
				conditions: [
					new Between(DatapointIdentifier.WATER_FLOW, 7, 10, "kcfs"),
					new Between(DatapointIdentifier.WATER_TEMP, toCelsius(40), toCelsius(50), "F"),
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "8+, 4x, 4+",
						conditions: [
							new LessThan(DatapointIdentifier.WATER_FLOW, 7, "kcfs")
						]
					}),
					new Restriction({
						category: 'Shell Types',
						description: "8+, 4x",
						conditions: [
							new AtLeast(DatapointIdentifier.WATER_FLOW, 7, "kcfs")
						]
					}),
					new Restriction({
						category: 'Racing',
						description: "No racing allowed"
					}),
					new Restriction({
						category: 'Launches',
						description: "1 launch per shell"
					}),
					new Restriction({
						category: 'Safety Gear',
						description: "<p><b>Coxswains</b>: PFD Required</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>No New Novices</p>"
					})
				]
			}),
			new SafetyZone({
				label: '5',
				color: '#ff0000',
				conditions: [
					new Between(DatapointIdentifier.WATER_FLOW, 10, 12, "kcfs"),
					new Between(DatapointIdentifier.WATER_TEMP, toCelsius(35), toCelsius(40), "F"),
					new Between(DatapointIdentifier.AIR_QUALITY, 150, 200, "AQI")
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "8+, 4x",
					}),
					new Restriction({
						category: 'Racing',
						description: "No racing allowed"
					}),
					new Restriction({
						category: 'Launches',
						description: "1 launch per shell"
					}),
					new Restriction({
						category: 'Safety Gear',
						description: "<p><b>Coxswains</b>: PFD Required</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>No Novices</p>"
					})
				]
			})
		],
		unsafeZone: new SafetyZone({
			label: '☠️',
			color: '#000000',
			conditions: [
				new AtLeast(DatapointIdentifier.WATER_FLOW, 12, "kcfs"),
				new LessThan(DatapointIdentifier.WATER_TEMP, toCelsius(35), "F"),
				new AtLeast(DatapointIdentifier.AIR_QUALITY, 200, "AQI")
			],
			restrictions: [
				new Restriction({
					category: 'Additional Info',
					description: "Water use not allowed."
				})
			]
		})
	}),
	dataSources: [
		{
			type: APIClientIdentifier.USGS,
			id: "04231600",
			purposeHints: [DatapointIdentifier.WATER_TEMP, DatapointIdentifier.WATER_FLOW],
			comment: "Ford St. Bridge"
		},
		{
			type: APIClientIdentifier.NOAA_WATER,
			id: "rohn6",
			purposeHints: [DatapointIdentifier.WATER_LEVEL],
			comment: "Ford St Bridge"
		},
		{
			type: APIClientIdentifier.NOAA_W1,
			id: "KROC",
			purposeHints: [DatapointIdentifier.AIR_TEMP, DatapointIdentifier.AIR_SPEED, DatapointIdentifier.AIR_DIRECTION],
			comment: "Greater Rochester International Airport"
		},
		{
			type: APIClientIdentifier.AIRNOW,
			id: "Eastern_Lake_Ontario_Region_NY",
			purposeHints: [DatapointIdentifier.AIR_QUALITY],
			friendlyPage: "https://www.airnow.gov/?city=Rochester&state=NY&country=USA",
			comment: "Eastern Lake Ontario Region"
		},
	]
});