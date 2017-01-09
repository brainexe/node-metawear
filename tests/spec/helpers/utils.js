var Utils = {
	isClose: function(fst, snd) {
		return Math.abs(fst - snd) <= Math.max( 0.001 * Math.max(Math.abs(fst), Math.abs(snd)), 0.001 );
	}
};

module.exports = Utils;