import Player = require("Player");
import Pile = require("Pile");
import Server = require("Server"); // TODO make this some sort of subscribe/publish model
import Tile = require("Tile");
import Util = require("Util");

function initializeBoard(numPlayers: number) {
    var tiles: Tile[] = Util.shuffle(Tile.tiles);
    var players = Player.makePlayers(numPlayers);
    var piles = Pile.piles;

    tiles.forEach(function(tile, idx) {
        (idx < 4 * numPlayers ? players[idx % numPlayers] : piles.middle).addTile(tile);
    });

    Util.byId("score").textContent = String(Util.score);
    Util.byId("clues").textContent = String(Util.numClues);
    Util.byId("oops").textContent = String(Util.numOops);

    Util.byId("clue").onclick = function() {
        if (Util.numClues > 0) {
            Util.giveClue();
            Server.turnTaken();
        }
    };

    // for debugging
    Util.updateNext(piles.middle.tiles[piles.middle.tiles.length - 1]);

    Server.init(numPlayers, players);

    Util.byId("current-player").textContent = players[Server.currentPlayer()].position;
}

initializeBoard(4);
