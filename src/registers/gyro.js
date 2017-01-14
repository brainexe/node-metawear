
var Config = require('./config/gyro');

const MODULE_OPCODE = 0x13;

const
    POWER_MODE = 0x1,
    DATA_INTERRUPT_ENABLE = 0x2,
    CONFIG = 0x3,
    DATA = 0x5;

var Gyro = function(device) {
    this.device = device;
    this.config = new Config();
};

Gyro.prototype.enableAxisSampling = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x1;
    buffer[3] = 0x0;
    this.device.send(buffer);
};

Gyro.prototype.disableAxisSampling = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x0;
    buffer[3] = 0x1;
    this.device.send(buffer);
};

Gyro.prototype.start = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Gyro.prototype.stop = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x0;
    this.device.send(buffer);
};


Gyro.prototype.enable = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x1;
    buffer[3] = 0x0;
    this.device.send(buffer);

    this.commitConfig();

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Gyro.prototype.disable = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x0;
    this.device.send(buffer);

    buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x0;
    buffer[3] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Gyro.prototype.onChange = function(callback) {
    var x, y, z;

    this.device.emitter.on([MODULE_OPCODE, DATA], function(buffer) {
        x = ~~buffer.readInt16LE(0) * this.config.scale;
        y = ~~buffer.readInt16LE(2) * this.config.scale;
        z = ~~buffer.readInt16LE(4) * this.config.scale;

        callback(x, y, z);
    }.bind(this));
};

Gyro.prototype.commitConfig = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = CONFIG;
    buffer[2] = this.config.frequency;
    buffer[3] = this.config.range;
    this.device.send(buffer);
};

module.exports = Gyro;
