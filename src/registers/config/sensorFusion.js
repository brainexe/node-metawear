var SensorFusionConfig = function() {

	this.CALIBRATION_ACCURACY = {
		UNRELIABLE: 0x0,
		LOW: 0x1,
		MEDIUM: 0x2,
		HIGH: 0x3
	};

	this.MODE = {
		SLEEP: 0x0,
		NDOF: 0x1,
		IMU_PLUS: 0x2,
		COMPASS: 0x3,
		M4G: 0x4
	};

	this.ACC_RANGE = {
		AR_2G: 0x0,
		AR_4G: 0x1,
		AR_8G: 0x2,
		AR_16G: 0x3
	};

};

module.exports = SensorFusionConfig;