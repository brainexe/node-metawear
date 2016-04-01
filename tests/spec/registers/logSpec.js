var Log = require('../../../src/registers/log'),
    Device   = require('../helpers/device'),
    bufferEqual = require('buffer-equal');

describe("Logging", function() {
	var device = new Device(),
			log = new Log(device);

	describe('setConfig()', function() {
		beforeEach(function() {
			spyOn(device, 'send').and.callThrough();
			jasmine.addCustomEqualityTester(bufferEqual);
		});

		it('should send the default log configuration', function() {
				//log.setConfig();
				//expect(device.send).toHaveBeenCalled();

				//expect(device.buffers.pop()).toEqual(new Buffer([0x3,0x3,0x27,0x3]));

		});
	});
					
});



