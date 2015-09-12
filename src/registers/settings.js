

const MODULE_OPCODE = 0x11;

var
    DEVICE_NAME = 0x1;

var Settings = function(device) {
    this.device = device;
};

Settings.prototype.deviceName = function() {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DEVICE_NAME;

    this.device.sendRead(buffer);
};

module.exports = Settings;
