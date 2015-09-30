
const MODULE_OPCODE = 0x07;

const
    ENABLE = 0x1,
    UUID = 0x2,
    MAJOR = 0x3,
    MINOR = 0x4,
    RX = 0x5,
    TX = 0x6,
    PERIOD = 0x7;

var IBeacon = function(device) {
    this.device = device;
};

IBeacon.prototype.enable = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x1;

    this.device.send(buffer);
};

IBeacon.prototype.disable = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x0;

    this.device.send(buffer);
};

// todo implement methods:
IBeacon.prototype.setMinor = function(major) {
};
IBeacon.prototype.setMajor = function(major) {
};
IBeacon.prototype.setUUID = function(uuid) {
};
IBeacon.prototype.setPeriod = function() {
};
IBeacon.prototype.setTxPower = function() {
};
IBeacon.prototype.setRxPower = function() {
};

module.exports = IBeacon;
