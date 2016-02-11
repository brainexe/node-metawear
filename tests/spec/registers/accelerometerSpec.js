var Accelerometer = require('../../../src/registers/accelerometer'),
    Device   = require('../helpers/device');

describe("Accelerometer", function() {
		var device = new Device(),
				accelerometer = new Accelerometer(device);

		it("should have 50hz as default value for output data rate", function() {
			expect(accelerometer.dataRate).toEqual(0x7);
		});

		it("should have +-2g as default axis sampling range", function() {
			expect(accelerometer.accRange).toEqual([0x3,    16384]);
		});
				
});

