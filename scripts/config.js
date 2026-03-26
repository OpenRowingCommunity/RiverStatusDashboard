import { APIClientIdentifier, DatapointIdentifier } from './constants.js';

import { ritconfig } from './clubs/rit.js';
import { trraconfig } from './clubs/trra.js';
import { grcconfig } from './clubs/grc.js';


let allClubs = {
	"RIT": ritconfig,
	"TRRA": trraconfig,
	"GRC": grcconfig
}

const getConfig = () => {
	const fragment = window.location.hash.substring(1);
	console.log(fragment);
	if (Object.keys(allClubs).includes(fragment)){
		return allClubs[fragment]
	}
	return trraconfig
}

// determine config
export let config = getConfig();

//Add "shared"/common data sources that do not require site identification strings
config.dataSources.push(...[
	{
		type: APIClientIdentifier.SUNRISE_SUNSET_ORG,
		purposeHints: [DatapointIdentifier.SUNRISE, DatapointIdentifier.SUNSET],
		comment: ""
	}
])

if (!config.plotColors) {
	config.plotColors = {
		flow: '#0088ff',
		flood: '#00ff00',
		temperature: '#ff0000'
	}
}

// (async () => {
//     config = await fetch("./config.json").then(response => response.json());
// })();
