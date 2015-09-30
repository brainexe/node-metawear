
function AmbientLightConfig() {
    this.GAIN = {
        GAIN_1X:  0, // range between [1, 64k] lux (default)
        GAIN_2X:  1, // range between [0.5, 32k] lux
        GAIN_4X:  2, // range between [0.25, 16k] lux
        GAIN_8X:  3, // range between [0.125, 8k] lux
        GAIN_48X: 6, // range between [0.02, 1.3k] lux
        GAIN_96X: 7  // range between [0.01, 600] lux
    };

    this.INTEGRATION_TIME = {
        TIME_100MS  : 0,
        TIME_50MS   : 1,
        TIME_200MS  : 2,
        TIME_400MS  : 3,
        TIME_150MS  : 4,
        TIME_250MS  : 5,
        TIME_300MS  : 6,
        TIME_350MS  : 7
    };

    this.MESSURE_TIME = {
        RATE_50MS   : 0,
        RATE_100MS  : 1,
        RATE_200MS  : 2,
        RATE_500MS  : 3, // Default setting
        RATE_1000MS : 4,
        RATE_2000MS : 5
    }
}

module.exports = AmbientLightConfig;
