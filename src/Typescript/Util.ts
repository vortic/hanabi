// These imports are potentially circular dependencies--use for type declarations only.
import Tile = require("Tile");

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
export var numClues = 8;
export var numOops = 3;
export var score = 0;

export var colorMap: {[color: string]: string} = {
    red: "#CE3131",
    white: "#EAEDD5",
    yellow: "#EAE317",
    green: "#28873D",
    blue: "#1BC1C4",
}

export function byId(id: string) {
    return document.getElementById(id);
}

export function getClue() {
    numClues = Math.min(8, numClues + 1);
    byId("clues").textContent = "Clues: " + numClues;
}

export function giveClue() {
    numClues = Math.max(0, numClues - 1);
    byId("clues").textContent = "Clues: " + numClues;
}

export function incrementScore() {
    score++;
    byId("score").textContent = "Score: " + score;
}

export function decrementOops() {
    numOops--;
    byId("oops").textContent = "Oops remaining: " + numOops;
}

// for debugging

export function updateNext(next: Tile) {
    if (next) {
        byId("nextPlay").style.color = colorMap[next.color];
        byId("nextPlay").textContent = String(next.number);
    }
}

export function updateLastPlay(tile: Tile) {
    byId("lastPlay").style.color = colorMap[tile.color];
    byId("lastPlay").textContent = String(tile.number);
    byId("valid").textContent = String(tile.isPlayable());
}
