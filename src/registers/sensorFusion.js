/*jshint esversion: 6*/

const Config = require('./config/sensorFusion');
const Core = require('./core');

const MODULE_OPCODE = 0x19;

const   W_OFFSET = 0,
		X_OFFSET = 4,
        Y_OFFSET = 8,
        Z_OFFSET = 12;


const ENABLE= 0x1,
	  MODE= 0x2,
	  OUTPUT_ENABLE= 0x3,
	  CORRECTED_ACC= 0x4,
	  CORRECTED_GYRO= 0x5,
	  CORRECTED_MAG= 0x6,
	  QUATERNION= 0x7,
	  EULER_ANGLES= 0x8,
	  GRAVITY_VECTOR= 0x9,
	  LINEAR_ACC= 0xa;
 
var SensorFusion = function(device) {
	this.device = device;
	this.config = new Config();
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