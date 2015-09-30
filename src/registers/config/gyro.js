
var util = require('./util');

function GyroConfig () {
    this.RATE_MAP = {
        25:     6,
        50:     7,
        100:    8,
        200:    9,
        400:    10,
        800:    11,
        1600:   12,
        3200:   13
    };

    this.RANGE_MAP = {
        2000: [0, 16.4], // +/-2000 degrees per second
        1000: [1, 32.8],
        500:  [2, 65.6],
        250:  [3, 131.2],
        125:  [4, 262.4]
    };

    this.scale = 0.01;
    this.setRange(125);
    this.setRate(25);
}

GyroConfig.prototype.setRate = function(hz) {
    this.frequency = util.findClosestValue(this.RATE_MAP, hz);
};

GyroConfig.prototype.setRange = function(range) {
    this.range = util.findClosestValue(this.RANGE_MAP, range)[0];
};

module.exports = GyroConfig;
