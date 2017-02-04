var SensorFusionConfig = function() {
	this.mode = SensorFusionConfig.MODE.SLEEP;
	this.acc_range = SensorFusionConfig.ACC_RANGE.AR_16G;
	this.gyro_range = SensorFusionConfig.GYRO_RANGE.GR_2000DPS;
};

const 	config_masks = [
        	[0x10, 0x11, 0x12, 0x13],
        	[0x20, 0x21, 0x22, 0x23],
        	[0x30, 0x31, 0x32, 0x33],
        	[0x40, 0x41, 0x42, 0x43]
    	];

SensorFusionConfig.CALIBRATION_ACCURACY = {
	UNRELIABLE: 0x0,
	LOW: 0x1,
	MEDIUM: 0x2,
	HIGH: 0x3
};

SensorFusionConfig.MODE = {
	SLEEP: 0x0,
	NDOF: 0x1,
	IMU_PLUS: 0x2,
	COMPASS: 0x3,
	M4G: 0x4
};

SensorFusionConfig.ACC_RANGE = {
	AR_2G: 0x0,
	AR_4G: 0x1,
	AR_8G: 0x2,
	AR_16G: 0x3
};

SensorFusionConfig.GYRO_RANGE = {
	GR_2000DPS: 0x0,
	GR_1000DPS: 0x1,
	GR_500DPS: 0x2,
	GR_250DPS: 0x3
};

SensorFusionConfig.prototype.setMode = function(mode) {
	this.mode = mode;
};
SensorFusionConfig.prototype.setAccRange = function(acc_range) {
	this.acc_range = acc_range;
};
SensorFusionConfig.prototype.setGyroRange = function(gyro_range) {
	this.gyro_range = gyro_range;
};
SensorFusionConfig.prototype.getConfigMask = function() {
	return config_masks[this.gyro_range][this.acc_range];
};

module.exports = SensorFusionConfig;