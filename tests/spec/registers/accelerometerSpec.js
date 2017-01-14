var Accelerometer = require('../../../src/registers/accelerometer'),
    Device   = require('../helpers/device'),
    bufferEqual = require('buffer-equal');

describe("Accelerometer", function() {
		var device = new Device(),
				accelerometer = new Accelerometer(device);

		it("should have 50hz as default value for output data rate", function() {
			expect(accelerometer.dataRate).toEqual(0x7);
		});

		it("should have +-2g as default axis sampling range", function() {
			expect(accelerometer.accRange).toEqual([0x3,    16384]);
		});

		describe("setConfig()", function() {
			
			beforeEach(function() {
				spyOn(device, 'send').and.callThrough();
				jasmine.addCustomEqualityTester(bufferEqual);
			});

			it("should send the configured output data rate and axis sampling range to the MetaWear device", function() {
				accelerometer.setConfig();
				expect(device.send).toHaveBeenCalled();
				expect(device.buffers.pop()).toEqual(new Buffer([0x3,0x3,0x27,0x3]));
			});
		});
				
});

