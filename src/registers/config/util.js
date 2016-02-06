
module.exports.findClosestValue = function(map, given) {
    var current;

    for (current in map) {
        if (given <= current) {
            break;
        }
    }

    // todo improve
    return map[current];

    if (i == map.length - 1) {
        // last element
        return map[current];
    }

    var leftDist  = boundedGiven - map[i];
    var rightDist = map[i + 1] - boundedGiven;
    if (leftDist < rightDist) {
        return i;
    } else {
        return i + 1;
    }

    return map[map.length - 1];
};
