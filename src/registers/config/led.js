
var LedConfig = function() {
    this.GREEN = 0x0;
    this.RED   = 0x1;
    this.BLUE  = 0x2;

    this.REPEAT_INDEFINITELY = 0xff;

    this.buffer = new Buffer(15);
    this.buffer.fill(0);

    this.buffer[1] = 0x2;
};

LedConfig.prototype.setColor = function(color) {
    this.buffer[0] = color;

    return this;
};

LedConfig.prototype.setHighIntensity = function(intensity) {
    this.buffer[2] = intensity;
    return this;
};

LedConfig.prototype.setLowIntensity = function(intensity) {
    this.buffer[3] = intensity;
    return this;
};

LedConfig.prototype.setRiseTime = function(time) {
    this.buffer[5] = (time >> 8) & 0xff;
    this.buffer[4] = time & 0xff;
    return this;
};

LedConfig.prototype.setHighTime = function(time) {
    this.buffer[7] = (time >> 8) & 0xff;
    this.buffer[6] = time & 0xff;
    return this;
};

LedConfig.prototype.setFallTime = function(time) {
    this.buffer[9] = (time >> 8) & 0xff;
    this.buffer[8] = time & 0xff;
    return this;
};

LedConfig.prototype.setPulseDuration = function(duration) {
    this.buffer[11] = (duration >> 8) & 0xff;
    this.buffer[10] = duration & 0xff;
    return this;
};

LedConfig.prototype.setRepeatCount = function(count) {
    this.buffer[14] = count;
    return this;
};

LedConfig.prototype.getBuffer = function() {
    return this.buffer;
};

LedConfig.prototype.patternBlink = function() {
    this.setHighIntensity(31);
    this.setLowIntensity(0);
    this.setRiseTime(0);
    this.setHighTime(50);
    this.setFallTime(0);
    this.setPulseDuration(500);
};

LedConfig.prototype.patternPulse = function() {
    this.setHighIntensity(31);
    this.setLowIntensity(31);
    this.setRiseTime(725);
    this.setHighTime(500);
    this.setFallTime(725);
    this.setPulseDuration(2000);
};

LedConfig.prototype.patternSolid = function() {
    this.setHighIntensity(31);
    this.setLowIntensity(31);
    this.setRiseTime(0);
    this.setHighTime(500);
    this.setFallTime(0);
    this.setPulseDuration(1000);
};

module.exports = LedConfig;
