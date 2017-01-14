/*jshint esversion: 6*/

const Config = require('./config/sensorFusion');
const Core = require('./core');
const Accelerometer = require('./accelerometer');
const Gyro = require('./gyro');
const Magnetometer = require('./magnetometer');

const MODULE_OPCODE = 0x19;

const   W_OFFSET = 0,
		X_OFFSET = 4,
        Y_OFFSET = 8,
        Z_OFFSET = 12;

const 	ENABLE= 0x1,
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
 
var SensorFusion = function(device) {
	this.device = device;
	this.config = new Config();
	this.dataSourceMask = 0x0;
	this.accelerometer = new Accelerometer(device);
	this.gyro = new Gyro(device);
	this.magnetometer = new Magnetometer(device);
};

SensorFusion.prototype.enableData = function(data_source) {
	this.dataSourceMask = 0x0;
	this.dataSourceMask |= (0x1 << data_source);
};

SensorFusion.prototype.clearEnabledMask = function() {
	this.dataSourceMask = 0x0;
};

SensorFusion.prototype.subscribe = function(output_type) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = output_type;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

SensorFusion.prototype.start = function() {

	switch(this.config.mode) {
		case Config.MODE.NDOF:
			this.accelerometer.enableAxisSampling();
			this.gyro.enableAxisSampling(); //TODO refactor the method name to be consistent
			this.magnetometer.enableAxisSampling();
			this.accelerometer.start();
			this.gyro.start();
			this.magnetometer.start();
			break;
	}
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = OUTPUT_ENABLE;
    buffer[2] = this.dataSourceMask;  
    buffer[3] = 0x0;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x1;

    this.device.send(buffer);
};

SensorFusion.prototype.stop = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x0;

    buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = OUTPUT_ENABLE;
    buffer[2] = 0x0;  
    buffer[3] = 0x7f;
    this.device.send(buffer);

	switch(this.config.mode) {
		case Config.MODE.NDOF:
			this.accelerometer.stop();
			this.gyro.stop();
			this.magnetometer.stop();
			this.accelerometer.disableAxisSampling();
			this.gyro.disableAxisSampling(); //TODO refactor the method name to be consistent
			this.magnetometer.disableAxisSampling();
			break;
	}

};

SensorFusion.prototype.unsubscribe = function(output_type) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = output_type;
    buffer[2] = 0x0;
    this.device.send(buffer);
};


SensorFusion.prototype.onChange = function(callback)  {
	this.device.emitter.on([MODULE_OPCODE, QUATERNION], function(buffer) {
		var quaternion = new Core.Quaternion(
			Math.round(buffer.readFloatLE(W_OFFSET) * 1000) / 1000,
			Math.round(buffer.readFloatLE(X_OFFSET) * 1000) / 1000,
			Math.round(buffer.readFloatLE(Y_OFFSET) * 1000) / 1000,
			Math.round(buffer.readFloatLE(Z_OFFSET) * 1000) / 1000);
		callback(quaternion);
	});
};

module.exports = SensorFusion;