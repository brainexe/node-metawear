var Log = require('../../../src/registers/log'),
    Device   = require('../helpers/device'),
    bufferEqual = require('buffer-equal');

describe("Logging", function() {
	var device = new Device(),
			log = new Log(device),
			module = 0xb,
			length = 0x5 | 0x80; // LENGTH Notification 

	describe('downloadLog()', function() {
		beforeAll(function() {
			spyOn(device, 'send').and.callThrough();
			spyOn(device, 'sendRead').and.callThrough();
			jasmine.addCustomEqualityTester(bufferEqual);
		});

		beforeEach(function() {
			device.reset();
		});

		it('should trigger the subscribtion to READOUT_PAGE_COMPLETED, READOUT_NOTIFY, READOUT_PROGRESS', function() {
			log.downloadLog();
			expect(device.send).toHaveBeenCalledTimes(3);
			expect(device.buffers[0]).toEqual(new Buffer([0xb,0xd,0x1]));
			expect(device.buffers[1]).toEqual(new Buffer([0xb,0x7,0x1]));
			expect(device.buffers[2]).toEqual(new Buffer([0xb,0x8,0x1]));
		});

		it('should trigger the reading of the length', function() {
			log.downloadLog();
			expect(device.sendRead).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0xb,0x85]));
		});

		it('should not READOUT the logs if it is empty', function() {

			var data = new Buffer([0x0,0x0,0x0,0x0]);
			log.downloadLog();
			
			expect(device.send.calls.any()).toBe(true);
			
			device.send.calls.reset();
			device.emitter.emit([module, length], data, module.toString(16), length.toString(16));
			
			expect(device.send.calls.any()).toBe(false);

		});

		xit('should READOUT the logs if not empty', function() {
			var data = new Buffer([0x9,0xb,0x0,0x0]);
			
			log.downloadLog();
			
			expect(device.send.calls.any()).toBe(true);
			
			device.send.calls.reset();
			device.emitter.emit([module, length], data, module.toString(16), length.toString(16));
			
			expect(device.send).toHaveBeenCalledTimes(1);

		});

	});
					
});



