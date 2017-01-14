/* jshint esversion: 6 */

/*
	This specification has been build based on the python test
	suite located at https://github.com/mbientlab/Metawear-CppAPI/blob/master/test/test_sensor_fusion.py
*/

var SensorFusion = require('../../../src/registers/sensorFusion'),
	SensorFusionConfig = require('../../../src/registers/config/sensorFusion'),
	Device = require('../helpers/device'),
	Core = require('../../../src/registers/core'),
	bufferEqual = require('buffer-equal'),
	clone = require('clone');


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

/* Data sources */

const	DATA_CORRECTED_ACC = 0,
		DATA_CORRECTED_GYRO = 1,
		DATA_CORRECTED_MAG = 2,
		DATA_QUATERION = 3,
		DATA_EULER_ANGLE = 4,
		DATA_GRAVITY_VECTOR = 5,
		DATA_LINEAR_ACC = 6;


const tests_output = [
	{
		'expected': new Core.Quaternion(0.940, -0.050, -0.154, -0.301),
		'response': new Buffer([0x1b,0x9b,0x70,0x3f,0x8c,0x5e,0x4d,0xbd,0x07,0x7f,0x1d,0xbe,0x78,0x02,0x9a,0xbe]),
		'data': QUATERNION
	}
];

const data_sources = [
		DATA_CORRECTED_ACC,
		DATA_CORRECTED_GYRO,
		DATA_CORRECTED_MAG,
		DATA_QUATERION,
		DATA_EULER_ANGLE,
		DATA_GRAVITY_VECTOR,
		DATA_LINEAR_ACC
];

/* The 'enable' property indexes the 'expected_start's item to mask in order to indicates the fusion's data_source */

const test_bases = [
	{
		'enable': 6,
		'mode': MODE_NDOF,
		'name': 'ndof',
		'expected_start': [
			new Buffer([0x03, 0x02, 0x01, 0x00]),
			new Buffer([0x13, 0x02, 0x01, 0x00]),
			new Buffer([0x15, 0x02, 0x01, 0x00]),
			new Buffer([0x03, 0x01, 0x01]),
			new Buffer([0x13, 0x01, 0x01]),
			new Buffer([0x15, 0x01, 0x01]),
			new Buffer([0x19, 0x03, 0x00, 0x00]),
			new Buffer([0x19, 0x01, 0x01])
		],
		'expected_stop': [
			new Buffer([0x19, 0x01, 0x00]),
			new Buffer([0x19, 0x03, 0x00, 0x7f]),
			new Buffer([0x03, 0x01, 0x00]),
			new Buffer([0x13, 0x01, 0x00]),
			new Buffer([0x15, 0x01, 0x00]),
			new Buffer([0x03, 0x02, 0x00, 0x01]),
			new Buffer([0x13, 0x02, 0x00, 0x01]),
			new Buffer([0x15, 0x02, 0x00, 0x01])
		]
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
		device.reset();
		device.send.calls.reset();
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

	describe('onChange listener', function() {

		var foo = {};

		beforeAll(function() {
			foo.callback =  function(data) { return data;};
			spyOn(foo,'callback').and.callThrough();
			sensorFusion.onChange(foo.callback);
		});

		//TODO : Implement every data type extraction
		xit('should properly extract any data type and execute the registered callback', function() {});

		it('should properly extract QUATERNION data type and execute the registered callback', function() {
			for(var i = 0; i < tests_output.length; i++) {
				device.emitter.emit([MODULE_OPCODE, tests_output[i].data], tests_output[i].response, MODULE_OPCODE.toString(16), tests_output[i].data.toString(32));
				expect(foo.callback.calls.argsFor(0)[0].isEqual(tests_output[i].expected)).toBe(true);
				foo.callback.calls.reset();
			}
		});
	});

	describe('NDOF mode', function() {
		var tests = [];

		beforeAll(function() {
			for(var i=0; i<test_bases.length; i++) {
				for(var j=0; j<data_sources.length; j++) {
					var test = clone(test_bases[i], false); // deep copy with no circular refs
					test.expected_start[test.enable][2] |= (0x1 << data_sources[j]);
					test.source = data_sources[j];
					tests.push(test);
				}
			}
		});

		describe('start()', function() {
			
			//TODO 
			xit('should enable [accelerometer, gyroscope, magnetometer] sampling, start the sensors and enable the NDOF fusion for [any type of output]', function() {});
			
			it('should enable [accelerometer, gyroscope, magnetometer] sampling, start the sensors and enable the NDOF fusion for [QUATERNION output type]', function() {
				for(var i = 0; i< tests.length; i++) {
					sensorFusion.config.setMode(tests[i].mode);
					sensorFusion.enableData(tests[i].source);
					sensorFusion.start();
					expect(device.send).toHaveBeenCalled();

					for(var j=0; j<device.buffers.length; j++) {
						expect(device.buffers[j]).toEqual(new Buffer(tests[i].expected_start[j]));	
					}
					device.reset();
				}
			});
		});

		describe('stop()', function() {

			// TODO
			xit('should disable the NDOF fusion for [any type of output], stop the sensors and disable the [accelerometer, gyroscope, magnetometer] sampling', function() {});

			it('should disable the NDOF fusion for [QUATERNION output type], stop the sensors and disable the [accelerometer, gyroscope, magnetometer] sampling', function() {
				for(var i = 0; i< tests.length; i++) {
					sensorFusion.stop();
					expect(device.send).toHaveBeenCalled();
					device.reset();
				}
			});
		});
	});

});