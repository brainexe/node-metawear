/*jshint esversion: 6 */

const MODULE_OPCODE = 0x15;

const POWER_MODE = 0x1,
      DATA_INTERRUPT_ENABLE = 0x2,
      DATA_RATE = 0x3,
      DATA_REPETITIONS = 0x4,
      MAG_DATA = 0x5,
      THRESHOLD_INTERRUPT_ENABLE = 0x6,
      THRESHOLD_CONFIG = 0x7,
      THRESHOLD_INTERRUPT = 0x8,
      PACKED_MAG_DATA = 0x9;

const	ODR_10_HZ = 0x0,
		ODR_2_HZ	= 0x1,
    	ODR_6_HZ	= 0x2,
    	ODR_8_HZ	= 0x3,
    	ODR_15_HZ	= 0x4,
    	ODR_20_HZ	= 0x5,
    	ODR_25_HZ	= 0x6,
    	ODR_30_HZ	= 0x7;

const 	PRESET_LOW_POWER = 0x0,
		PRESET_REGULAR = 0x1,
		PRESET_ENHANCED_REGULAR = 0x2,
		PRESET_HIGH_ACCURACY = 0x3;

const 	X_OFFSET = 0,
		Y_OFFSET = 2,
		Z_OFFSET = 4;


var Magnetometer = function (device) {
    this.device = device;
};

Magnetometer.prototype.enableAxisSampling = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x1;
    buffer[3] = 0x0;
    this.device.send(buffer);
};

Magnetometer.prototype.disableAxisSampling = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x0;
    buffer[3] = 0x1;
    this.device.send(buffer);
};

Magnetometer.prototype.start = function() {
	var buffer = new Buffer(3);
	buffer[0] = MODULE_OPCODE;
	buffer[1] = POWER_MODE;
	buffer[2] = 0x1;
	this.device.send(buffer);
};

Magnetometer.prototype.stop = function() {
	var buffer = new Buffer(3);
	buffer[0] = MODULE_OPCODE;
	buffer[1] = POWER_MODE;
	buffer[2] = 0x0;
	this.device.send(buffer);
};

Magnetometer.prototype.subscribe = function() {
	var buffer = new Buffer(3);
	buffer[0] = MODULE_OPCODE;
	buffer[1] = MAG_DATA;
	buffer[2] = 0x1;
	this.device.send(buffer);
};

Magnetometer.prototype.unsubscribe = function() {
	var buffer = new Buffer(3);
	buffer[0] = MODULE_OPCODE;
	buffer[1] = MAG_DATA;
	buffer[2] = 0x0;
	this.device.send(buffer);
};

Magnetometer.prototype.onChange = function(callback) {

	this.device.emitter.on([MODULE_OPCODE, MAG_DATA], function(buffer) {

		var formatted = {
				x: buffer.readInt16LE(X_OFFSET) / 16,
				y: buffer.readInt16LE(Y_OFFSET) / 16,
				z: buffer.readInt16LE(Z_OFFSET) / 16
		};

		callback(formatted);

	});
};

Magnetometer.prototype.writeConfig = function(xy_reps, z_reps, dataRate) {
	var buffer = new Buffer(4);
	buffer[0] = MODULE_OPCODE;
	buffer[1] = DATA_REPETITIONS;
	buffer[2] = (xy_reps - 1) / 2;
	buffer[3] = (z_reps - 1);
	this.device.send(buffer);

	buffer = new Buffer(3);
	buffer[0] = MODULE_OPCODE;
	buffer[1] = DATA_RATE;
	buffer[2] = dataRate;
	this.device.send(buffer);

};

Magnetometer.prototype.setPreset = function(preset) {
	switch(preset) {
		case PRESET_LOW_POWER:
			this.writeConfig(3,3,ODR_10_HZ);
			break;
		case PRESET_REGULAR:
			this.writeConfig(9,15,ODR_10_HZ);
			break;
		case PRESET_ENHANCED_REGULAR:
			this.writeConfig(15,27,ODR_10_HZ);
			break;
		case PRESET_HIGH_ACCURACY:
			this.writeConfig(47,83,ODR_20_HZ);
			break;
	}
};

Magnetometer.PRESET_LOW_POWER = PRESET_LOW_POWER;
Magnetometer.PRESET_REGULAR = PRESET_REGULAR;
Magnetometer.PRESET_ENHANCED_REGULAR = PRESET_ENHANCED_REGULAR;
Magnetometer.PRESET_HIGH_ACCURACY = PRESET_HIGH_ACCURACY;


module.exports = Magnetometer;

