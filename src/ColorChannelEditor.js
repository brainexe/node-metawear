
var ColorChannelEditor = function() {
    this.GREEN = 0x0;
    this.RED   = 0x1;
    this.BLUE  = 0x2;

    this.buffer = new Buffer(15);
    this.buffer.fill(0);

    this.buffer[1] = 0x2;
};

ColorChannelEditor.prototype.setColor = function(color) {
    this.buffer[0] = color;

    return this;
};
ColorChannelEditor.prototype.setHighIntensity = function(intensity) {
    this.buffer[2] = intensity;
    return this;
};

ColorChannelEditor.prototype.setLowIntensity = function(intensity) {
    this.buffer[3] = intensity;
    return this;
};

ColorChannelEditor.prototype.setRiseTime = function(time) {
    this.buffer[5] = ((time >> 8) & 0xff);
    this.buffer[4] = (time & 0xff);
    return this;
};

ColorChannelEditor.prototype.setHighTime = function(time) {
    this.buffer[7] = ((time >> 8) & 0xff);
    this.buffer[6] = (time & 0xff);
    return this;
};

ColorChannelEditor.prototype.setFallTime = function(time) {
    this.buffer[9] = ((time >> 8) & 0xff);
    this.buffer[8] = (time & 0xff);
    return this;
};

ColorChannelEditor.prototype.setPulseDuration = function(duration) {
    this.buffer[11] = ((duration >> 8) & 0xff);
    this.buffer[10] = (duration & 0xff);
    return this;
};

ColorChannelEditor.prototype.setRepeatCount = function(count) {
    this.buffer[14] = count;
    return this;
};

ColorChannelEditor.prototype.getBuffer = function() {
    return this.buffer;
};

module.exports = ColorChannelEditor;
