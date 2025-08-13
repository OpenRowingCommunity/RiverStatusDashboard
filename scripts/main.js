//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		main.js created on 2017-06-26

//	make requirejs calls here


//	dev/debug stuff here
let devMode = true;

/// Set up various helper functions on the ko object for later use
let ko_addons = function() {

	/// # persistence
	// https://keestalkstech.com/automatic-knockout-model-offline-persistence/#track-a-change-and-restore-it
	ko.trackChange = (store, observable, key, echo = null) => {
		//initialize from stored value, or if no value is stored yet,
		//use the current value

		const value = store.get(key)
		if(value !== null){
			if(echo) echo("Restoring value for", key, value)

			//restore current value
			observable(value)
		}

		//track the changes
		observable.subscribe(newValue => {
			if(echo) echo("Storing new value for", key, newValue)
			store.set(key, newValue)
		})
	}
	
	
	
	ko.persistChanges = (model, options = {storage: localStorage}) => {
		const storageWrapper = {
			set: (key, value) => options.storage.setItem(key, JSON.stringify(value)),
			get: key => JSON.parse(options.storage.getItem(key))
		}

		const persist = new Set(model.__persist || [])

		for (let key in model) {
			const observable = model[key]

			if (!persist.has(key)) {
				if (devMode) {
					console.log("Skipping", key, "because it is not on the __persist list.")
				}
				continue
			}

			if (ko.isComputed(observable)) {
				if (devMode) {
					console.log("Skipping", n, "because it is computed.")
				}
				continue
			}

			if (!ko.isObservable(observable)) {
				if (devMode) {
					console.log("Skipping", key, "because it is not observable.")
				}
				continue
			}

			ko.trackChange(storageWrapper, observable, key, false)
			if (devMode) {
				console.log("Tracking change for", key)
			}

		}
	}
}

//	main block - declare before executing
let main = async function () {
	$('#attributionRow').slideUp();
	ko_addons();
	var viewModel = new AppViewModel();
	var bindingContext = document.getElementById('koBindingContext');
	ko.applyBindings(viewModel, bindingContext);
	window.vm = viewModel;

	ko.persistChanges(viewModel);
	
	//	set to update every 15 minutes
	window.autoRefresher = setInterval(function () {
		window.vm.update();
	}, 1000*60*15);
	
	//	set last-updated stuff
	$('#refresh-button').mouseover(function () {
		window.vm.lastUpdatedVisible(true);
	});
	$('#refresh-button').mouseout(function () {
		window.vm.lastUpdatedVisible(false);
	});
	
	if (viewModel.graphEnabled()) {
		setupGraphStructures();
		await populateDataSets();
		// await populateDataSets();
		// renderGraph();
	}
};

//	call main once page has loaded
window.onload = async function () {
	await main();
	window.vm.update();
	window.vm.toggleAttribution();
}

// EOF
