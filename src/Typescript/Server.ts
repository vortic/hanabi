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
    turn.className += "mb-2";
    turn.textContent = players[currentPlayer].position + " "
            + (turnInfo.clueType
                    ? "clued " + turnInfo.player.position + " on "
                    : turnInfo.discard ? "discarded" : "played") + " ";
    if (turnInfo.tile) {
        var clueOnNumber = typeof(turnInfo.clueType) === "number";
        var clueOnColor = typeof(turnInfo.clueType) === "string";
        var textContent = String(turnInfo.tile.number) + (turnInfo.clueType ? "" : "");
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
        if (clueOnNumber) {
            color = "";
        }
        var tileDescription = document.createElement("span");
        tileDescription.textContent = textContent;
        if (!clueOnNumber) {
            tileDescription.className = "inline-tile font-color-white";
            tileDescription.style.backgroundColor = color;
        }
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
