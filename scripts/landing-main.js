// scripts/landing.js
import { allClubs } from './config.js';

const LandingViewModel = function() {
    // Transform the allClubs object into an array for the UI
    // Object.keys(allClubs) gives us ["RIT", "TRRA", "GRC"]
    this.availableClubs = Object.keys(allClubs).map(key => {
        return {
            id: key,
            name: allClubs[key].clubFullName,
			acronym: allClubs[key].clubAcronym,
            river: allClubs[key].riverName + " River"
        };
    });
};

// Activate Knockout
ko.applyBindings(new LandingViewModel(), document.getElementById('landing-context'));