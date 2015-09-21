

module.exports.findClosestValue = function(map, given) {
    var current;
    // todo implement improved logic
    for (current in map) {
        if (given <= current) {
            return map[current];
        }
    }
    return map[map.length - 1];
};
