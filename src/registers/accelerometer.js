/* jshint esversion: 6 */

var util = require('./config/util');

const MODULE_OPCODE = 0x03;

const   X_OFFSET = 0,
        Y_OFFSET = 2,
        Z_OFFSET = 4;

const
    POWER_MODE              = 0x1,
    DATA_INTERRUPT_ENABLE   = 0x2,
    DATA_CONFIG             = 0x3,
    DATA_INTERRUPT          = 0x4,
    DATA_INTERRUPT_CONFIG   = 0x5;
    LOW_HIGH_G_INTERRUPT_ENABLE = 0x6;
    LOW_HIGH_G_CONFIG       = 0x7;
    LOW_HIGH_G_INTERRUPT    = 0x8;
    MOTION_CONFIG           = 0xa;
    MOTION_INTERRUPT        = 0xb;
    TAP_INTERRUPT_ENABLE    = 0xc;
    TAP_CONFIG              = 0xd;
    ORIENT_INTERRUPT_ENABLE = 0xf;
    ORIENT_CONFIG           = 0x10;
    ORIENT_INTERRUPT        = 0x11;
    FLAT_INTERRUPT_ENABLE   = 0x12;
    FLAT_CONFIG             = 0x13;
    FLAT_INTERRUPT          = 0x14;
    STEP_DETECTOR_INTERRUPT_ENABLE = 0x17;
    STEP_DETECTOR_CONFIG    = 0x18;
    STEP_DETECTOR_INTERRUPT = 0x19;
    STEP_COUNTER_DATA       = 0x1a;
    STEP_COUNTER_RESET      = 0x1b;

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

// Operating frequency of the accelerometer. Unit: "hz"
const OUTPUT_DATA_RATE = {
    "0.78125": 0x1,
    "1.5625":  0x2,
    "3.125":   0x3,
    "6.25":    0x4,
    "12.5":    0x5,
    "25.0":    0x6,
    "50.0":    0x7,
    "100.0":   0x8,
    "200.0":   0xa,
    "400.0":   0xb,
    "800.0":   0xc,
    "1600.0":  0xd,
    "3200.0":  0xe
};

// Supported g-ranges for the accelerometer. Unit "g"
const ACC_RANGE = {
    //g     bitmask, scale
    2:      [0x3,    16384],
    4:      [0x5,    8192],
    8:      [0x8,    4096],
    16:     [0xc,    2048]
};

var Accelerometer = function(device) {
    this.device   = device;
    this.setOutputDataRate(50);
    this.setAxisSamplingRange(2);
};

Accelerometer.prototype.start = function() {


    // TODO : Move the respective configuration into a proper method

    // var buffer = new Buffer(4);
    // buffer[0] = MODULE_OPCODE;
    // buffer[1] = TAP_CONFIG;
    // buffer[2] = 0x04; // TODO configurable values
    // buffer[3] = 0x0a;
    // this.device.send(buffer);

    // buffer = new Buffer(6);
    // buffer[0] = MODULE_OPCODE;
    // buffer[1] = MOTION_CONFIG;
    // buffer[2] = 0x00; // TODO configurable values
    // buffer[3] = 0x14;
    // buffer[4] = 0x14;
    // buffer[5] = 0x14;
    // this.device.send(buffer);

    // buffer = new Buffer(4);
    // buffer[0] = MODULE_OPCODE;
    // buffer[1] = DATA_CONFIG;
    // buffer[2] = 0x20 | this.dataRate;
    // buffer[3] = this.accRange[0];
    // this.device.send(buffer);

    // buffer = new Buffer(7);
    // buffer[0] = MODULE_OPCODE;
    // buffer[1] = LOW_HIGH_G_CONFIG;
    // buffer[2] = 0x07; // TODO configurable values
    // buffer[3] = 0x30;
    // buffer[4] = 0x81;
    // buffer[5] = 0x0b;
    // buffer[6] = 0xc0;
    // this.device.send(buffer);

    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Accelerometer.prototype.enableStepDetector = function(callback, sensitivity) {
    var config = new Buffer(2);
    switch (sensitivity) {
        case 'ROBUST':
            config[0] = 0x1d;
            config[1] = 0x7;
            break;
        case 'SENSITIVE':
            config[0] = 0x2d;
            config[1] = 0x3;
            break;
        case 'NORMAL':
        default:
            config[0] = 0x15;
            config[1] = 0x3;
            break;
    }

    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = STEP_DETECTOR_CONFIG;
    buffer[2] = config[0];
    buffer[3] = config[1] | 0x08;
    this.device.send(buffer);

    buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = STEP_DETECTOR_INTERRUPT_ENABLE;
    buffer[2] = 0x1;
    buffer[3] = 0x0;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = STEP_DETECTOR_INTERRUPT;
    buffer[2] = 0x1;
    this.device.send(buffer);

    this.device.emitter.on([MODULE_OPCODE, STEP_DETECTOR_INTERRUPT], function() {
        callback();
    });
};

Accelerometer.prototype.disableStepDetector = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = STEP_DETECTOR_INTERRUPT_ENABLE;
    buffer[2] = 0x0;
    buffer[3] = 0x1;
    this.device.send(buffer);
};

Accelerometer.prototype.resetStepCounter = function() {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = STEP_COUNTER_RESET;
    this.device.send(buffer);
};

Accelerometer.prototype.readStepCounter = function(callback, silent) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = STEP_COUNTER_DATA;
    buffer[2] = silent;
    this.device.sendRead(buffer);

    this.device.emitter.once([MODULE_OPCODE, STEP_COUNTER_DATA], function(buffer) {
        callback(buffer.readInt16LE(0));
    });
};

Accelerometer.prototype.onChange = function(callback) {
    var scale = this.accRange[1];

    this.device.emitter.on([MODULE_OPCODE, DATA_INTERRUPT], function(buffer) {
        var formatted = {
            x: buffer.readInt16LE(X_OFFSET) / scale,
            y: buffer.readInt16LE(Y_OFFSET) / scale,
            z: buffer.readInt16LE(Z_OFFSET) / scale
        };
        callback(formatted);
    });
};

// TODO : Rename setConfig to writeConfig
Accelerometer.prototype.setConfig = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_CONFIG;
    buffer[2] = 0x20 | this.dataRate;
    buffer[3] = this.accRange[0];
    this.device.send(buffer);
};

/**
 * Set the sampling range. between 2g and 16g
 * @param {Number} rate
 */
Accelerometer.prototype.setAxisSamplingRange = function(rate) {
    this.accRange = util.findClosestValue(ACC_RANGE, rate);
};

/**
 * Set output data rate in HZ
 * @param {Number} frequency
 */
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
// TODO rename to unsubscribe to me more consistent
Accelerometer.prototype.enableNotifications = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT;
    buffer[2] = 0x1;
    this.device.send(buffer);
};
Accelerometer.prototype.unsubscribe = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT;
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
