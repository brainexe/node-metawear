
var util = require('./config/util');

const MODULE_OPCODE = 0x03;

const   X_OFFSET = 0,
        Y_OFFSET = 2,
        Z_OFFSET= 4;

const
    POWER_MODE              = 0x1,
    DATA_INTERRUPT_ENABLE   = 0x2,
    DATA_CONFIG             = 0x3,
    DATA_INTERRUPT          = 0x4,
    DATA_INTERRUPT_CONFIG   = 0x5;
    LOW_HIGH_G_INTERRUPT_ENABLE = 0x6;
    LOW_HIGH_G_CONFIG       = 0x7;
    LOW_HIGH_G_INTERRUPT    = 0x8;
    ORIENT_INTERRUPT_ENABLE = 0xf;
    ORIENT_CONFIG           = 0x10;
    ORIENT_INTERRUPT        = 0x11;
    FLAT_INTERRUPT_ENABLE   = 0x12;
    FLAT_CONFIG             = 0x13;
    FLAT_INTERRUPT          = 0x14;

const BOARD_ORIENTATION = {
    FACE_UP_PORTRAIT_UPRIGHT:       0x0,
    FACE_UP_PORTRAIT_UPSIDE_DOWN:   0x1,
    FACE_UP_LANDSCAPE_LEFT:         0x2,
    FACE_UP_LANDSCAPE_RIGHT:        0x3,
    FACE_DOWN_PORTRAIT_UPRIGHT:     0x4,
    FACE_DOWN_PORTRAIT_UPSIDE_DOWN: 0x5,
    FACE_DOWN_LANDSCAPE_LEFT:       0x6,
    FACE_DOWN_LANDSCAPE_RIGHT:      0x7
};

// data rate in HZ
const OUTPUT_DATA_RATE = {
    25:     0x6,
    50:     0x7,
    100:    0x8,
    200:    0xa,
    400:    0xb,
    800:    0xc,
    1600:   0xd,
    3200:   0xe
};

// unit "g"
const ACC_RANGE = {
    2:  0x3,
    4:  0x5,
    8:  0x8,
    16: 0xc
};

var Accelerometer = function(device) {
    this.device   = device;
    this.dataRate = 0x20 | util.findClosestValue(OUTPUT_DATA_RATE, 100);
    this.accRange = util.findClosestValue(ACC_RANGE, 2);
};

Accelerometer.prototype.start = function() {
    /*
    // TODO
    if (highHysteresis != null) {
        bmi160LowHighConfig[2]|= ((int) (highHysteresis / HIGH_HYSTERESIS_STEPS[bmi160AccRange.ordinal()]) & 0x3) << 6;
    }

    if (highThreshold != null) {
        bmi160LowHighConfig[4]= (byte) (highThreshold / HIGH_THRESHOLD_STEPS[bmi160AccRange.ordinal()]);
    }
    */

    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_CONFIG;
    buffer[2] = this.dataRate;
    buffer[3] = this.accRange;
    this.device.send(buffer);

    buffer = new Buffer(7);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = LOW_HIGH_G_CONFIG;
    buffer[2] = 0x7;
    buffer[3] = 0x30;
    buffer[4] = 0x81;
    buffer[5] = 0x0b;
    buffer[6] = 0xc0;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Accelerometer.prototype.onChange = function(callback) {
    this.device.on([MODULE_OPCODE, DATA_INTERRUPT], function(buffer) {
        var formatted = {
            x: buffer.readFloatLE(X_OFFSET),
            y: buffer.readFloatLE(Y_OFFSET),
            z: buffer.readFloatLE(Z_OFFSET)
        };
        callback(formatted);
    });
};

Accelerometer.prototype.setConfig = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_CONFIG;
    buffer[2] = 0x1; // TODO set correct value
    buffer[3] = 0x1;
    this.device.send(buffer);
};

// todo see Bmi160AccelerometerImpl.java
Accelerometer.prototype.setAxisSamplingRange = function(rate) {
};

Accelerometer.prototype.setOutputDataRate = function(frequency) {
    this.dataRate = util.findClosestValue(OUTPUT_DATA_RATE, frequency);
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
    buffer[2] = 0x1;
    buffer[3] = 0x0;
    this.device.send(buffer);
};

Accelerometer.prototype.disableAxisSampling = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x0;
    buffer[3] = 0x1;
    this.device.send(buffer);
};

module.exports = Accelerometer;
