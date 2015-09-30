
var Config = require('./config/led');

const MODULE_OPCODE = 0x02;

const
    PLAY = 0x1,
    STOP = 0x2,
    MODE = 0x3;

var Led = function(device) {
    this.config = new Config();
    this.device = device;
};

/**
 * @param {Boolean} autoPlay
 */
Led.prototype.play = function(autoPlay) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PLAY;
    buffer[2] = autoPlay ? 2 : 1;

    this.device.send(buffer);
};

Led.prototype.pause = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PLAY;
    buffer[2] = 0x0;

    this.device.send(buffer);
};

Led.prototype.stop = function(clearConfig) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = STOP;
    buffer[2] = clearConfig;

    this.device.send(buffer);
};

Led.prototype.commitConfig = function() {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = MODE;

    this.device.send(Buffer.concat([buffer, this.config.getBuffer()]));
};

module.exports = Led;
