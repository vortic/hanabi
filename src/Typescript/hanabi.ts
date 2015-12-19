import Player = require("Player");
import Pile = require("Pile");
import Tile = require("Tile");
import Util = require("Util");

function initializeBoard(numPlayers: number) {
    var tiles: Tile[] = Util.shuffle(Tile.tiles);
    var players = Player.makePlayers(numPlayers);
    var piles = Pile.piles;

    tiles.forEach(function(tile, idx) {
        var isPlayer = idx < 4 * numPlayers;
        var pile = (isPlayer ? players[idx % numPlayers] : piles.middle);
        pile.tiles.push(tile);
        (isPlayer ? pile.node : piles.middle.colors[tile.node.style.color]).appendChild(tile.node);
    });

    var score = 0;
    var numClues = 8;
    var numOops = 3;
    Util.byId("score").textContent = "Score: " + score;
    Util.byId("clues").textContent = "Clues: " + numClues;
    Util.byId("oops").textContent = "Oops remaining: " + numOops;

    Util.byId("play").onclick = function() {
        if (! players[0].playTile(piles, 0)) {
            numOops--;
            Util.byId("oops").textContent = "Oops remaining: " + numOops;
        } else {
            score++;
            Util.byId("score").textContent = "Score: " + score;
        }

    };
    Util.byId("discard").onclick = function() {
        players[0].playTile(piles, 0, true);
        numClues = Math.min(8, numClues + 1);
        Util.byId("clues").textContent = "Clues: " + numClues;
    };
    Util.byId("clue").onclick = function() {
        numClues = Math.max(0, numClues - 1);
        Util.byId("clues").textContent = "Clues: " + numClues;
    };

    // for debugging
    var next = piles.middle.tiles[piles.middle.tiles.length - 1];
    Util.byId("nextPlay").style.color = next.node.style.color;
    Util.byId("nextPlay").textContent = next.node.textContent;
}

initializeBoard(4);
