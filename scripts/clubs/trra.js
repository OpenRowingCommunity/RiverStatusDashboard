import { RiverStatusConfig, Restriction, SafetyMatrix, SafetyZone, LessThan, AtLeast, GreaterThan, Between } from "../safetyTypes.js";

import { DatapointIdentifier, APIClientIdentifier } from "../constants.js";
import { toCelsius } from "../helpers.js";

export let trraconfig = new RiverStatusConfig({
	riverName: "Allegheny",
	clubFullName: "Three Rivers Rowing Association",
	clubAcronym: "TRRA",
	boathouseLat: 40.466846,
	boathouseLong: -79.976543,
	safetyMatrix: new SafetyMatrix({
		version: "2024 Rowing Matrix: Revised May 2024 by TRRA Safety Committee and accepted by TRRA Board",
		source: "https://www.threeriversrowing.org/_files/ugd/e46300_61356ec9d051465e9e9bd249ff77e3b4.pdf",
		safetyZones: [
			new SafetyZone({
				label: '1',
				color: '#00c020',
				conditions: [
					new LessThan(DatapointIdentifier.WATER_FLOW, 30, "kcfs"),
					new AtLeast(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F"),
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "All boats"
					}),
					new Restriction({
						category: 'Racing',
						description: "Racing allowed"
					}),
					new Restriction({
						category: 'Launches',
						description: "Not Required. See Appendix #5 for U18/HS"
					}),
					new Restriction({
						category: 'Certification',
						description: "TRRA-Equivalent Certification"
					}),
					new Restriction({
						category: 'PFDs',
						description: "<p><b>Rowers</b>: PFD not required</p>" +
							"<p><b>Coxswains</b>: PFD Required to be worn from November 1st through April 30th</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>"
					}),
					new Restriction({
						category: 'Comms',
						description: "A whistle is <i>required</i> and protected cell phone recommended in each launch or in each shell not accompanied by a launch"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>U14: approved</p>" +
							"<p>Novice: approved</p>" +
							"<p>Experienced: approved</p>" +
							"<p>Adaptive: approved</p>"
					})
				]
			}),
			new SafetyZone({
				label: '2',
				color: '#40fe00',
				conditions: [
					new Between(DatapointIdentifier.WATER_FLOW, 30, 40, "kcfs"),
					new AtLeast(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F"),
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "<p>Racing shells: All types</p>" +
						"<p>Adaptive shells: All boats</p>"
					}),
					new Restriction({
						category: 'Racing',
						description: "Racing allowed"
					}),
					new Restriction({
						category: 'Launches',
						description: "1 launch per 3 shells"
					}),
					new Restriction({
						category: 'Certification',
						description: "TRRA-Equivalent Certification"
					}),
					new Restriction({
						category: 'PFDs',
						description: "<p><b>Rowers</b>: PFD Recommended to be worn or in shell for 1x, 2x, 2-</p>" +
							"<p><b>Coxswains</b>: PFD Required to be worn from November 1st through April 30th</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>"
					}),
					new Restriction({
						category: 'Comms',
						description: "Protected cell phone and whistle <i>required</i> in each launch <i>and</i> recommended in each shell"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>U14: restricted</p>" +
							"<p>Novice: approved</p>" +
							"<p>Experienced: approved</p>" +
							"<p>Adaptive: approved</p>"
					})
				]
			}),
			new SafetyZone({
				label: '3',
				color: '#c8ff00',
				conditions: [
					new Between(DatapointIdentifier.WATER_FLOW, 40, 45, "kcfs"),
					new LessThan(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F"),
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "8+, 4+, 4x, 4-, 2x",
						conditions: [
							new LessThan(DatapointIdentifier.WATER_FLOW, 40, "kcfs")
						]
					}),
					new Restriction({
						category: 'Shell Types',
						description: "8+, 4+, 4x, 4-",
						conditions: [
							new AtLeast(DatapointIdentifier.WATER_FLOW, 40, "kcfs")
						]
					}),
					new Restriction({
						category: 'Racing',
						description: "No racing allowed (see appendix #6)"
					}),
					new Restriction({
						category: 'Launches',
						description: "1 launch per 2 shells"
					}),
					new Restriction({
						category: 'Certification',
						description: "TRRA-Equivalent Certification"
					}),
					new Restriction({
						category: 'PFDs',
						description: "<p><b>Rowers</b>: PFD Recommended to be worn or in shell for all rowers</p>" +
							"<p><b>Coxswains</b>: PFD Required to be worn from November 1st through April 30th</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>"
					}),
					new Restriction({
						category: 'Comms',
						description: "Protected cell phone and whistle <i>required</i> in each launch <i>and</i> recommended in each shell"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>U14: restricted</p>" +
							"<p>Novice: limited*</p>" +
							"<p>Experienced: approved</p>" +
							"<p>Adaptive: inclusion</p>"
					})
				]
			}),
			new SafetyZone({
				label: '4',
				color: '#ffff00',
				conditions: [
					new Between(DatapointIdentifier.WATER_FLOW, 45, 50, "kcfs"),
					new LessThan(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F"),
				],
				restrictions: [
					new Restriction({
						category: 'Shell Types',
						description: "8+, 4+, 4x",
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
						category: 'Certification',
						description: "TRRA-Equivalent Certification"
					}),
					new Restriction({
						category: 'PFDs',
						description: "<p><b>Rowers</b>: PFD Recommended to be worn or in shell at all times (see appendix #7)</p>" +
							"<p><b>Coxswains</b>: PFD Required to be worn from November 1st through April 30th</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>",
						conditions: [
							new GreaterThan(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F")
						]
					}),
					new Restriction({
						category: 'PFDs',
						description: "<p><b>Rowers</b>: PFD Required to be worn by all rowers</p>" +
							"<p><b>Coxswains</b>: PFD Required to be worn from November 1st through April 30th</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>",
						conditions: [
							new LessThan(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F")
						]
					}),
					new Restriction({
						category: 'Comms',
						description: "Protected cell phone and whistle <i>required</i> in each launch <i>and</i> recommended in each shell"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>U14: restricted</p>" +
							"<p>Novice: limited*</p>" +
							"<p>Experienced: approved</p>" +
							"<p>Adaptive: inclusion</p>"
					})
				]
			}),
			new SafetyZone({
				label: '5',
				color: '#ffa800',
				conditions: [
					new Between(DatapointIdentifier.WATER_FLOW, 50, 60, "kcfs"),
					new LessThan(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F"),
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
						description: "1 launch per shell and sufficient launches to:<br>" + 
						"(a) carry all rowers and coxes participating in the session<br>" +
						"(b) have at least 2 engines between all launches on the water (towing line required)"
					}),
					new Restriction({
						category: 'Certification',
						description: "TRRA-Equivalent Certification"
					}),
					new Restriction({
						category: 'PFDs',
						description: "<p><b>Rowers</b>: PFD Recommended to be worn or in shell at all times</p>" +
							"<p><b>Coxswains</b>: PFD Required to be worn from November 1st through April 30th</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>",
						conditions: [
							new GreaterThan(DatapointIdentifier.WATER_TEMP, toCelsius(50), "F")
						]
					}),
					new Restriction({
						category: 'PFDs',
						description: "<p><b>Rowers</b>: PFD Required to be worn by all rowers</p>" +
							"<p><b>Coxswains</b>: PFD Required to be worn from November 1st through April 30th</p>" + 
							"<p><b>Coaches & Launch Occupants</b>: PFD to be worn at all times</p>",
						conditions: [
							new Between(DatapointIdentifier.WATER_TEMP, toCelsius(32), toCelsius(50), "F")
						]
					}),
					new Restriction({
						category: 'Comms',
						description: "Protected cell phone required in each launch and shell. Marine radio recommended for coaches. At least one additional person must be on shore with cell phone and car (see Appendix #8)"
					}),
					new Restriction({
						category: 'Crew Skill',
						description: "<p>U14: restricted</p>" +
							"<p>Novice: limited*</p>" +
							"<p>Experienced: approved</p>" +
							"<p>Adaptive: inclusion</p>"
					}),
					new Restriction({
						category: 'More Requirements',
						description: "Additional requirements apply in this zone. See the safety matrix appendix #8."
					})
				]
			})
		],
		unsafeZone: new SafetyZone({
			label: '\u2715',
			color: '#000000',
			conditions: [
				new AtLeast(DatapointIdentifier.WATER_FLOW, 60, "kcfs")
			],
			restrictions: [
				new Restriction({
					category: 'Shell Types',
					description: "No boats allowed on the water"
				}),
				new Restriction({
					category: 'Launches',
					description: "I said no boats"
				}),
				new Restriction({
					category: 'Certification',
					description: "TRRA-Equivalent Certification"
				}),
				new Restriction({
					category: 'PFDs',
					description: "Don't need any to stay on land"
				}),
				new Restriction({
					category: 'Crew Skill',
					description: "None required for staying on land"
				})
			]
		})
	}),
	dataSources: [
		{
			type: APIClientIdentifier.USGS,
			id: "03049640",
			purposeHints: [DatapointIdentifier.WATER_TEMP],
			comment: "Allegheny R at CW Bill Young L&D at Acmetonia, PA"
		},
		{
			type: APIClientIdentifier.NOAA_W1,
			id: "KPIT",
			purposeHints: [DatapointIdentifier.AIR_TEMP, DatapointIdentifier.AIR_SPEED, DatapointIdentifier.AIR_DIRECTION],
			comment: "Pittsburgh International Airport"
		},
		{
			type: APIClientIdentifier.NOAA_WATER,
			id: "shrp1",
			purposeHints: [DatapointIdentifier.WATER_LEVEL, DatapointIdentifier.WATER_FLOW],
			comment: "Allegheny River at Sharpsburg Lock and Dam"
		},
		{
			type: APIClientIdentifier.AIRNOW,
			id: "Pittsburgh_PA",
			purposeHints: [DatapointIdentifier.AIR_QUALITY],
			friendlyPage: "https://www.airnow.gov/?city=Pittsburgh&state=PA&country=USA",
			comment: "Pittsburgh, PA Reporting area"
		},
	]
});