const fs = require('fs');

function parseInput(fileName) {
    const content = fs.readFileSync(fileName, 'utf8');
    return content.split('\n').map(l => { return { D: l[0], L: parseInt(l.substring(1)) }})
}

function reverseDirection(direction) {
    switch (direction) {
        case N:
            return "S";
        case S:
            return "N";
        case E:
            return "W";
        default:
            return "E";
    }
}

function parseTurn(pos, order) {
    cd = ["N", "E", "S", "W"];
    turn = order.D == 'R' ? 1 : -1;
    posInCd = cd.indexOf(pos[2]);

    for (var i = 0; i < order.L / 90; i++) {
        posInCd = (posInCd + turn + 4) % 4;
    }

    return cd[posInCd];
}

function moveShip(pos, order) {
    // console.log(pos, order);
    var newPos = [...pos];

    switch (order.D) {
        case "N":
            newPos[1] += order.L;
            break;
        case "E":
            newPos[0] += order.L;
            break;
        case "S":
            newPos[1] -= order.L;
            break;
        case "W":
            newPos[0] -= order.L;
            break;
        case "F":
            order.D = pos[2];
            newPos = moveShip(pos, order);
            break;
        case "B":
            order.D = reverseDirection(pos[2]);
            newPos = moveShip(pos, order);
            break;
        default:
            newPos[2] = parseTurn(pos, order);
            break;
    }

    return newPos;
}

function parseRotate(waypoint, order) {
    turn = order.D == 'R' ? 1 : -1;

    for (var i = 0; i < order.L / 90; i++) {
        if (order.D === 'R') {
            waypoint = [waypoint[1], - waypoint[0]]
        } else {
            waypoint = [- waypoint[1], waypoint[0]]
        }
    }

    return waypoint;
}

function moveByWaypoint(pos, waypoint, instruction) {
    var newPos = [...pos];
    var newWaypoint = [...waypoint];

    switch (instruction.D) {
        case "N":
            newWaypoint[1] += instruction.L;
            break;
        case "E":
            newWaypoint[0] += instruction.L;
            break;
        case "S":
            newWaypoint[1] -= instruction.L;
            break;
        case "W":
            newWaypoint[0] -= instruction.L;
            break;
        case "F":
            newPos = [pos[0] + waypoint[0] * instruction.L, pos[1] + waypoint[1] * instruction.L];
            break;
        default:
            newWaypoint = parseRotate(waypoint, instruction);
            break;
    }

    return [newPos, newWaypoint];
}

function part1 (startPosition, instructions) {
    pos = [...startPosition];

    instructions.forEach(inst => {
        pos = moveShip(pos, inst);
    });

    return Math.abs(pos[0]) + Math.abs(pos[1]);
}

function part2 (startPosition, startWaypoint, instructions) {
    var pos = [...startPosition];
    var waypoint = [...startWaypoint];
    
    instructions.forEach(inst => {
        [pos, waypoint] = moveByWaypoint(pos, waypoint, inst);
    });
    
    return Math.abs(pos[0]) + Math.abs(pos[1]);
}

const input = parseInput(process.argv[2]);

var startPosition1 = [0, 0, "E"];
var startPosition2 = [0, 0];
var startWaypoint = [10, 1];

console.log(part1(startPosition1, JSON.parse(JSON.stringify(input))));
console.log(part2(startPosition2, startWaypoint, JSON.parse(JSON.stringify(input))));
