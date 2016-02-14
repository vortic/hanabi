import Pile = require("Pile");
import Player = require("Player");
import Tile = require("Tile");
import Util = require("Util");

export var currentPlayer: number;
var players: Player[];
var tilesRemaining: number;
var turnsRemaining: number;

export function init(p: Player[]) {
    currentPlayer = 0;
    players = p;
    tilesRemaining = Pile.piles.middle.tiles.length;
    turnsRemaining = players.length;
    players[currentPlayer].myTurn();
}

export function turnTaken(tile?: Tile, discard = false) {
    var clue = ! tile;
    var turn = document.createElement("div");
    turn.textContent = "Player " + players[currentPlayer].position + " "
            + (clue ? "Clued" : discard ? "Discarded" : "Played") + " ";
    if (tile) {
        var tileDescription = document.createElement("span");
        tileDescription.textContent = String(tile.number);
        tileDescription.style.color = Util.colorMap[tile.color];
        turn.appendChild(tileDescription);
    }
    Util.byId("turn-log").appendChild(turn);
    players[currentPlayer].myTurn(false);
    currentPlayer = (currentPlayer + 1) % players.length;
    Util.byId("current-player").textContent = players[currentPlayer].position;
    players[currentPlayer].myTurn();
    if (! clue) {
        tilesRemaining = Math.max(0, tilesRemaining - 1);
    }
    if (tilesRemaining === 0) {
        turnsRemaining--;
    }
    if (turnsRemaining < 0) {
        if (Util.score >= 25) {
            alert("You win!");
        } else {
            alert("You lose! (Out of time)");
        }
    }
}
