// Magnetometer Specifications
var Magnetometer = require('../../../src/registers/magnetometer'),
    Device   = require('../helpers/device'),
    bufferEqual = require('buffer-equal');

var MODULE_OPCODE = 0x15;

var MAG_DATA = 0x5;

var PRESET_LOW_POWER				= 0x0,
		PRESET_REGULAR					= 0x1,
		PRESET_ENHANCED_REGULAR = 0x2,
		PRESET_HIGH_ACCURACY		= 0x3;

var ODR_10_HZ = 0x0,
    ODR_2_HZ	= 0x1,
    ODR_6_HZ	= 0x2,
    ODR_8_HZ	= 0x3,
    ODR_15_HZ	= 0x4,
    ODR_20_HZ	= 0x5,
    ODR_25_HZ	= 0x6,
    ODR_30_HZ	= 0x7;

var BFIELD_X_AXIS_INDEX = 0x1,
		BFIELD_Y_AXIS_INDEX = 0x2,
		BFIELD_Z_AXIS_INDEX = 0x3;

describe('Magnetometer', function() {
	var device = new Device(),
      magnetometer = new Magnetometer(device);

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

	describe('enableAxisSampling()', function() {
		it('should enable sampling on the magnetometer', function() {
			magnetometer.enableAxisSampling();
			expect(device.send).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0x15,0x2,0x1,0x0]));
		});
	});

	describe('disableAxisSampling()', function() {
		it('should disable sampling on the magnetometer', function() {
			magnetometer.disableAxisSampling();
			expect(device.send).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0x15,0x2,0x0,0x1]));
		});
	});

	describe('start()', function() {
		it('should power on the magnetometer', function() {
			magnetometer.start();
			expect(device.send).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0x15,0x1,0x1]));
		});
	});

	describe('stop()', function() {
		it('should power off the magnetometer', function() {
			magnetometer.stop();
			expect(device.send).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0x15,0x1,0x0]));
		});
	});

	describe('subscribe()', function() {
		it('should subscribe to the magnetometer notification', function() {
			magnetometer.subscribe();
			expect(device.send).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0x15,0x5,0x1]));
		});
	});

	describe('unsubscribe()', function() {
		it('should unsubscribe to the magnetometer notification', function() {
			magnetometer.unsubscribe();
			expect(device.send).toHaveBeenCalled();
			expect(device.buffers.pop()).toEqual(new Buffer([0x15,0x5,0x0]));
		});
	});

	describe('onChange', function() {
		it('should properly extract magnetometer data coded on 8 bytes and execute the callback', function() {
			var data = new Buffer([0x4e,0xf0,0x53,0x0a,0x75,0x04]);
			var expectedData = {x: -251.1250, y: 165.1875, z: 71.3125};
			var foo = {
				callback: function(magnetometer_data) {
					return magnetometer_data;
				}
			};
			spyOn(foo,'callback').and.callThrough();
			magnetometer.onChange(foo.callback);
			device.emitter.emit([MODULE_OPCODE, MAG_DATA], data, MODULE_OPCODE.toString(16), MAG_DATA.toString(32));

			expect(foo.callback.calls.argsFor(0)[0].x).toEqual(expectedData.x);
			expect(foo.callback.calls.argsFor(0)[0].y).toEqual(expectedData.y);
			expect(foo.callback.calls.argsFor(0)[0].z).toEqual(expectedData.z);
		});
	});


});
