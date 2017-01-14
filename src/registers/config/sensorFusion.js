var SensorFusionConfig = function() {
	this.mode = SensorFusionConfig.MODE.SLEEP;
	this.acc_range = SensorFusionConfig.ACC_RANGE.AR_16G;
	this.gyro_range = SensorFusionConfig.GYRO_RANGE.GR_2000DPS;
};

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

module.exports = SensorFusionConfig;