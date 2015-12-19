// These imports are potentially circular dependencies--use for type declarations only.
import Pile = require("Pile");
import Tile = require("Tile");

export function byId(id: string) {
    return document.getElementById(id);
}

export function isPlayable(tile: Tile, played: Pile) {
    return played.highestPlayed[tile.node.style.color] === +tile.node.textContent - 1;
}

// taken from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array: any[]) {
    var currentIndex = array.length,
        temporaryValue: number,
        randomIndex: number;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

export var colors = ["red", "white", "yellow", "green", "blue"];
export var numbers = [1, 2, 3, 4, 5];
