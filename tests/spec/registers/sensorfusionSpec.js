/* jshint esversion: 6 */

var SensorFusion = require('../../../src/registers/sensorFusion'),
	SensorFusionConfig = require('../../../src/registers/config/sensorFusion'),
	Device = require('../helpers/device'),
	Core = require('../../../src/registers/core'),
	bufferEqual = require('buffer-equal');


const	MODULE_OPCODE = 0x19;

const 	MODE_SLEEP = 0x0,
		MODE_NDOF = 0x1,
		MODE_IMU_PLUS = 0x2,
		MODE_COMPASS = 0x3,
		MODE_M4G = 0x4;

const	ACC_RANGE_2G = 0x0,
		ACC_RANGE_4G = 0x1,
		ACC_RANGE_8G = 0x2,
		ACC_RANGE_16G = 0x3;

const	GYRO_RANGE_2000DPS = 0x0,
		GYRO_RANGE_1000DPS = 0x1,
		GYRO_RANGE_500DPS = 0x2,
		GYRO_RANGE_250DPS = 0x3;

const	ENABLE= 0x1,
		MODE= 0x2,
		OUTPUT_ENABLE= 0x3,
		CORRECTED_ACC= 0x4,
		CORRECTED_GYRO= 0x5,
		CORRECTED_MAG= 0x6,
		QUATERNION= 0x7,
		EULER_ANGLES= 0x8,
		GRAVITY_VECTOR= 0x9,
		LINEAR_ACC= 0xa;


const	tests = [
	{
		'expected': new Core.Quaternion(0.940, -0.050, -0.154, -0.301),
		'response': new Buffer([0x1b,0x9b,0x70,0x3f,0x8c,0x5e,0x4d,0xbd,0x07,0x7f,0x1d,0xbe,0x78,0x02,0x9a,0xbe]),
		'data': QUATERNION
	}
];



describe('SensorFusion - Metawear Motion R Board', function() {
	var device = new Device(),
     	sensorFusion;

	beforeAll(function() {
		spyOn(device, 'send').and.callThrough();
		jasmine.addCustomEqualityTester(bufferEqual);
	});

	beforeEach(function() {
		sensorFusion = new SensorFusion(device);
	});

	describe('Configuration', function() {

		it('should be in sleep mode by default', function() {
			expect(sensorFusion.config.mode).toEqual(MODE_SLEEP);
		});

		it('should be configured with a 16G accelerometer range  by default', function() {
			expect(sensorFusion.config.acc_range).toEqual(ACC_RANGE_16G);
		});

		it('should be configured with a 2000 DPS (degrees per second °/s) gyroscope range  by default', function() {
			expect(sensorFusion.config.gyro_range).toEqual(GYRO_RANGE_2000DPS);
		});		

		xdescribe('writeConfig() for a configured NDOF mode', function() {
			
			beforeAll(function() {
				device.reset();
				device.send.calls.reset();
				sensorFusion.config.setMode(SensorFusionConfig.MODE.NDOF);
			});

			// it('should send the NDOF mode, accelerometer and gyroscope range to the device', function() {
			// 	device.writeConfig();
			// 	expect(device.send).toHaveBeenCalled();
			// 	expect(device.buffers[0]).toEqual(new Buffer([0x19, 0x02, MODE_NDOF, 0x13]));
			// 	expect(device.buffers[1]).toEqual(new Buffer([0x03, 0x03, 0x28, 0xC]));
			// 	expect(device.buffers[2]).toEqual(new Buffer([0x13, 0x03, 0x28, 0x4]));
			// 	expect(device.buffers[3]).toEqual(new Buffer([0x15, 0x04, 0x04, 0x0e]));
			// 	expect(device.buffers[4]).toEqual(new Buffer([0x15, 0x03, 0x6]));
			// });

		});

	});

	describe('onChange', function() {

		var foo = {};

		beforeAll(function() {
			foo.callback =  function(magnetometer_data) { return magnetometer_data;};
			spyOn(foo,'callback').and.callThrough();
			sensorFusion.onChange(foo.callback);
			
		});

		it('should properly extract any data type and execute the callback', function() {
			for(var i = 0; i < tests.length; i++) {
				device.emitter.emit([MODULE_OPCODE, tests[i].data], tests[i].response, MODULE_OPCODE.toString(16), tests[i].data.toString(32));
				expect(foo.callback.calls.argsFor(0)[0].isEqual(tests[i].expected)).toBe(true);
				foo.callback.calls.reset();
			}
		});
	});

});