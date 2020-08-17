var Direction;
(function (Direction) {
    debugger
    Direction[Direction["NORTH"] = 3] = "NORTH";
    Direction[Direction["SOUTH"] = 4] = "SOUTH";
    Direction[Direction["EAST"] = 5] = "EAST";
    Direction[Direction["WEST"] = 6] = "WEST";
})(Direction || (Direction = {}));
var dir = Direction.NORTH;
console.log(dir);
