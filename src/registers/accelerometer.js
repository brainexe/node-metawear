
const MODULE_OPCODE = 0x03;

const
    POWER_MODE = 0x1,
    DATA_INTERRUPT_ENABLE = 0x2,
    DATA_CONFIG = 0x3,
    INTERRUPT = 0x4,
    DATA_INTERRUPT_CONFIG = 0x5;

var Accelerometer = function(device) {
    this.device = device;
};

Accelerometer.prototype.start = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

// todo see Bmi160AccelerometerImpl.java
Accelerometer.prototype.setAxisSamplingRange = function(rate) {
};
Accelerometer.prototype.setOutputDataRate = function(frequency) {
};

Accelerometer.prototype.stop = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x0;
    this.device.send(buffer);
};

Accelerometer.prototype.enableAxisSampling = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x0;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Accelerometer.prototype.disableAxisSampling = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x0;
    buffer[2] = 0x0;
    this.device.send(buffer);
};

module.exports = Accelerometer;
