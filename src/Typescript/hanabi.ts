import Player = require("Player");
import Pile = require("Pile");
import Tile = require("Tile");
import Util = require("Util");

function initializeBoard(numPlayers: number) {
    var tiles: Tile[] = Util.shuffle(Tile.tiles);
    var players = Player.makePlayers(numPlayers);
    var piles = Pile.piles;

    tiles.forEach(function(tile, idx) {
        (idx < 4 * numPlayers ? players[idx % numPlayers] : piles.middle).addTile(tile);
    });

    Util.byId("score").textContent = "Score: " + Util.score;
    Util.byId("clues").textContent = "Clues: " + Util.numClues;
    Util.byId("oops").textContent = "Oops remaining: " + Util.numOops;

    Util.byId("clue").onclick = function() {
        Util.giveClue();
    };

    // for debugging
    Util.updateNext(piles.middle.tiles[piles.middle.tiles.length - 1]);
}

initializeBoard(4);
