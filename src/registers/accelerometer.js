
const MODULE_OPCODE = 0x03;

const
    POWER_MODE          = 0x1,
    DATA_INTERRUPT_ENABLE = 0x2,
    DATA_CONFIG         = 0x3,
    DATA_INTERRUPT      = 0x4,
    DATA_INTERRUPT_CONFIG = 0x5;
    LOW_HIGH_G_CONFIG   = 0x7;

const BoardOrientation = {
    FACE_UP_PORTRAIT_UPRIGHT:       0x0,
    FACE_UP_PORTRAIT_UPSIDE_DOWN:   0x1,
    FACE_UP_LANDSCAPE_LEFT:         0x2,
    FACE_UP_LANDSCAPE_RIGHT:        0x3,
    FACE_DOWN_PORTRAIT_UPRIGHT:     0x4,
    FACE_DOWN_PORTRAIT_UPSIDE_DOWN: 0x5,
    FACE_DOWN_LANDSCAPE_LEFT:       0x6,
    FACE_DOWN_LANDSCAPE_RIGHT:      0x7
};

var Accelerometer = function(device) {
    this.device = device;
};

Accelerometer.prototype.start = function() {
    var buffer = new Buffer(7);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = LOW_HIGH_G_CONFIG;
    buffer[2] = 0x7;
    buffer[3] = 0x30;
    buffer[4] = 0x81;
    buffer[5] = 0x0b;
    buffer[6] = 0xc0;
    this.device.send(buffer);

    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Accelerometer.prototype.setConfig = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_CONFIG;
    buffer[2] = 0x1; // TODO set correct value
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
