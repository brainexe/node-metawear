/* jshint esversion: 6 */

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

var SensorFusion = require('../../../src/registers/sensorFusion'),
		Device = require('../helpers/device'),
		bufferEqual = require('buffer-equal');

describe('SensorFusion - Metawear Motion R Board', function() {
	var device = new Device(),
     	sensorFusion = new SensorFusion(device);

	beforeAll(function() {
		spyOn(device, 'send').and.callThrough();
		jasmine.addCustomEqualityTester(bufferEqual);
	});

	describe('Configuration', function() {

		it('should be in sleep mode by default', function() {
			expect(sensorFusion.config.mode).toEqual(MODE_SLEEP);
		});

		it('should be configure with a 16G accelerometer range  by default', function() {
			expect(sensorFusion.config.acc_range).toEqual(ACC_RANGE_16G);
		});

		it('should be configure with a 2000 DPS (degrees per second °/s) gyroscope range  by default', function() {
			expect(sensorFusion.config.gyro_range).toEqual(GYRO_RANGE_2000DPS);
		});		

		describe('writeConfig() for a configured NDOF mode', function() {
			
			beforeEach(function() {
				device.reset();
				device.send.calls.reset();
			});

			// it('should send the NDOF mode, accelerometer and gyroscope range to the device', function() {
			// 	device.writeConfig();
			// 	expect(device.send).toHaveBeenCalled();
			// 	expect(device.buffers.pop()).toEqual(new Buffer([]));
			// });

		});

	});

});