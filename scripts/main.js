//		RiverStatusBoard: Information for Rowers and Paddlers
//		Allegheny River information for Three Rivers Rowing Association (TRRA)
//		by Maxwell B Garber <max.garber+dev@gmail.com>
//		main.js created on 2017-06-26

//	make requirejs calls here


//	dev/debug stuff here
let devMode = true;

//	main block - declare before executing
let main = function () {
	$('#attributionRow').slideUp();
	
	var viewModel = new AppViewModel();
	var bindingContext = document.getElementById('koBindingContext');
	ko.applyBindings(viewModel, bindingContext);
	window.vm = viewModel;
	
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
		populateDataSets();
		// await populateDataSets();
		// renderGraph();
	}
};

//	call main once page has loaded
window.onload = function () {
	main();
	window.vm.update();
	window.vm.toggleAttribution();
}

// EOF
