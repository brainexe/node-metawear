
var ColorChannelEditor = require('../util/ColorChannelEditor');

const MODULE_OPCODE = 0x2;

var
    PLAY = 0x1,
    STOP = 0x2,
    MODE = 0x3;

var Led = function(device) {
    this.ColorChannelEditor = ColorChannelEditor;
    this.device = device;
};

/**
 * @param {Boolean} autoplay
 */
Led.prototype.play = function(autoplay) {
    var buffer = new Buffer(3);
    buffer.fill(0);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PLAY;
    buffer[2] = autoplay ? 2 : 1;

    this.device.send(buffer);
};

Led.prototype.pause = function() {
    var buffer = new Buffer(3);
    buffer.fill(0);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PLAY;
    buffer[2] = 0;

    this.device.send(buffer);
};

Led.prototype.stop = function(resetChannelAttrs) {
    var buffer = new Buffer(3);
    buffer.fill(0);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = STOP;
    buffer[2] = resetChannelAttrs;

    this.device.send(buffer);
};

Led.prototype.setMode = function(config) {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = MODE;

    this.device.send(Buffer.concat([buffer, config.getBuffer()]));
};

module.exports = Led;
