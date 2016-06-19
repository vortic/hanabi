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

interface TurnInfo {
    player: Player;
    tile: Tile;
    discard?: boolean;
    // the number or color being clued
    clueType?: number|string;
    // which tile(s) the clue applies to
    indices?: number[];
}

export function turnTaken(turnInfo: TurnInfo) {
    var turn = document.createElement("div");
    turn.className += "log-row";
    turn.textContent = players[currentPlayer].position + " "
            + (turnInfo.clueType
                    ? "clued " + turnInfo.player.position + " on "
                    : turnInfo.discard ? "discarded" : "played") + " ";
    if (turnInfo.tile) {
        var clueOnNumber = typeof(turnInfo.clueType) === "number";
        var clueOnColor = typeof(turnInfo.clueType) === "string";
        var textContent = String(turnInfo.tile.number);
        if (clueOnColor) {
            textContent = turnInfo.tile.color;
        }
        if (turnInfo.clueType) {
            textContent +=
                    " ("
                    + turnInfo.indices.map(i => ["first", "second", "third", "fourth"][i]).join(", ")
                    + " tile)";
        }
        var color = Util.colorMap[turnInfo.tile.color];
        var tileDescription = document.createElement("span");
        if (clueOnNumber) {
            color = "";
            tileDescription.className = "inline-tile-blank";
        } else {
            tileDescription.className = "inline-tile" + (color == "#EAEDD5" ? " font-color-black" : "");
        }
        tileDescription.textContent = textContent;
        tileDescription.style.backgroundColor = color;
        console.log(color);
        turn.appendChild(tileDescription);
    }
    Util.byId("turn-log").appendChild(turn);
    players[currentPlayer].myTurn(false);
    currentPlayer = (currentPlayer + 1) % players.length;
    Util.byId("current-player").textContent = players[currentPlayer].position;
    players[currentPlayer].myTurn();
    if (! turnInfo.clueType) {
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
