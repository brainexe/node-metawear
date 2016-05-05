var Log = require('../../../src/registers/log'),
    Device   = require('../helpers/device'),
    bufferEqual = require('buffer-equal');

describe("Logging", function() {
	var device = new Device(),
			log = new Log(device),
			MODULE = 0xb, // LOG
			LENGTH = 0x5; // LENGTH  
			READOUT_NOTIFY = 0x7; //READOUT_NOTIFY

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

		it('should not trigger the log READOUT if no entries', function() {

			var data = new Buffer([0x0,0x0,0x0,0x0]);
			log.downloadLog();
			
			expect(device.send.calls.any()).toBe(true);
			
			device.send.calls.reset();
			device.emitter.emit([MODULE, LENGTH], data, MODULE.toString(16), LENGTH.toString(16));
			
			expect(device.send.calls.any()).toBe(false);

		});

		it('should trigger the log READOUT specifying the correct number of entries to be notified for 0.05 notification progress', function() {
			var data = new Buffer([0x68,0x8,0x0,0x0]);
			
			log.downloadLog();
			
			expect(device.send.calls.any()).toBe(true);
			
			device.send.calls.reset();

			
			expect(device.send).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0xb,0x6,0x68,0x8,0x0,0x0,0x6b,0x0,0x0,0x0]));
		});

		describe('log data processing', function() {
			it('should process two distinct record from a 20 bytes data frame ', function() {
				
				var data = new Buffer([0x40,0x3c,0xf9,0x91,0x18,0x8a,0xfc,0x87,0x4,0x41,0x3c,0xf9,0x91,0x18,0x84,0x41,0x0,0x0]);
				var accelerometerData_1 = {x: 0, y: 0, z: 0};
				var accelerometerData_2 = {x: 0, y: 0, z: 0};
				
				var foo = {
					callback: function(data) {
						return data;
					}
				};

				spyOn(foo.callback).and.callThrough();
				log.downloadLog(foo.callback);
				device.emitter.emit([MODULE, READOUT_NOTIFY], data, MODULE.toString(16), READOUT_NOTIFY.toString(16));

				expect(foo.setBar.calls.argsFor(0)).toEqual([accelerometerData_1]);
				expect(foo.setBar.calls.argsFor(1)).toEqual([accelerometerData_2]);


			});
		});

	});
					
});



