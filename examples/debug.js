var metawear = require('./../src/device');

metawear.discover(function(device) {
	
	device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

	device.connectAndSetup(function(error) {
		console.log('Were connected!');
		console.log('Reset in 5 seconds');
		
		var debug = new device.Debug(device);
		
		setTimeout(function() {
			debug.reset();
			console.log('Reset done !');
		}, 5000);

	});

});