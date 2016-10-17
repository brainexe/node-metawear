var Device = require('../helpers/device'),
		Settings = require('../../../src/registers/settings'),
		bufferEqual = require('buffer-equal');

describe('Settings', function() {
	var device = new Device(),
			settings = new Settings(device);

	describe('setConnectionParameter(...)', function() {
		beforeEach(function() {
			spyOn(device, 'send').and.callThrough();
			jasmine.addCustomEqualityTester(bufferEqual);
		});

		it('should send the correct connection parameters to the device', function() {
			settings.setConnectionParameters(750.0, 1000.0, 128, 16384);
			expect(device.send).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0x11, 0x09, 0x58, 0x02, 0x20, 0x03, 0x80, 0x00, 0x66, 0x06]));
		});
	});

});