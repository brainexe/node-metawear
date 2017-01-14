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

const X_OFFSET = 0,
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

module.exports = Magnetometer;

