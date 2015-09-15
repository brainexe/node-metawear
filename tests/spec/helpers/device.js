
var Device = function() {
    this.buffers = [];
};

Device.prototype.send = function(buffer) {
    this.buffers.push(buffer);
};

module.exports = Device;
