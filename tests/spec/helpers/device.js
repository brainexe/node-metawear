var events = require('events');

var Device = function() {
  this.buffers = [];
  this.emitter = new events.EventEmitter();
};

Device.prototype.send = function(buffer) {
  this.buffers.push(buffer);
};

Device.prototype.sendRead = function(buffer) {
	buffer[1] |= 0x80;
  this.buffers.push(buffer);
};

Device.prototype.reset = function() {
	this.buffers = [];
};

module.exports = Device;
