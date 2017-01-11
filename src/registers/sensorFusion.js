/*jshint esversion: 6*/

const Config = require('./config/sensorFusion');

const MODULE_OPCODE = 0x19;
 
var SensorFusion = function(device) {
	this.device = device;
	this.config = new Config();
};

module.exports = SensorFusion;