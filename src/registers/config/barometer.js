
function BarometerConfig() {
    this.SAMPLING_MODE = {
        SKIP:               0,
        ULTRA_LOW_POWER:    1,
        LOW_POWER:          2,
        STANDARD:           3,
        HIGH:               4,
        ULTRA_HIGH:         5
    };

    this.FILTER_MODE = {
        OFF:    0,
        AVG_2:  1,
        AVG_4:  2,
        AVG_8:  3,
        AVG_16: 4
    };

    this.STANDBY_TIME = {
        TIME_0_5:   0,
        TIME_62_5:  1,
        TIME_125:   2,
        TIME_250:   3,
        TIME_500:   4,
        TIME_1000:  5,
        TIME_2000:  6,
        TIME_4000:  7
    };

    this.filterMode   = this.FILTER_MODE.OFF;
    this.standbyTime  = this.STANDBY_TIME.TIME_125;
    this.samplingMode = this.SAMPLING_MODE.STANDARD;
}

module.exports = BarometerConfig;
