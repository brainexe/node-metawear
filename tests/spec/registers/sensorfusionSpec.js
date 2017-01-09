var SensorFusion = require('../../../src/registers/sensorfusion'),
		Device = require('../helpers/device'),
		bufferEqual = require('buffer-equal');

describe('SensorFusion', function() {
	var device = new Device(),
      sensorFusion = new SensorFusion(device);

	beforeAll(function() {
		spyOn(device, 'send').and.callThrough();
		spyOn(device, 'sendRead').and.callThrough();
		jasmine.addCustomEqualityTester(bufferEqual);
	});

	beforeEach(function() {
		device.reset();
		device.send.calls.reset();
		device.sendRead.calls.reset();
	});


});