import Pile = require("Pile");
import Tile = require("Tile");
import Util = require("Util");

class Player {
    node: HTMLElement;
    tiles: Tile[] = [];
    constructor(public type: string) {
        this.node = document.createElement("div");
        this.node.className = "tiles " + this.type;
        var typeNode = document.createElement("div");
        typeNode.textContent = this.type;
        this.node.appendChild(typeNode);
    }
    addTile(tile: Tile) {
        tile.node.classList.remove("played");
        this.tiles.push(tile);
        this.node.appendChild(tile.node);
        tile.toggleActive(true);
        tile.node.onclick = (event) => {
            this.playTile(tile, event.target === tile.discardNode);
        };
    }
    removeTile(tile: Tile) {
        tile.toggleActive(false);
        tile.node.onclick = null;
        tile.discardNode.classList.add("hidden");
    }
    playTile(tile: Tile, discard = false) {
        var piles = Pile.piles;
        this.removeTile(tile);
        this.tiles.splice(this.tiles.indexOf(tile), 1);
        var toGive = piles.middle.tiles.pop();
        if (toGive) {
            this.addTile(toGive);
            Util.updateNext(piles.middle.tiles[piles.middle.tiles.length - 1]); // for debugging
        }
        var playable = tile.isPlayable();
        Util.updateLastPlay(tile); // for debugging
        (discard || ! playable ? piles.discarded : piles.played).addTile(tile);
        if (! discard) {
            if (playable) {
                piles.played.highestPlayed[tile.color]++;
                Util.incrementScore();
                if (tile.number === 5) {
                    Util.getClue();
                }
            } else {
                Util.decrementOops();
            }
        } else {
            Util.getClue();
        }
        if (Util.score >= 25) {
            alert("You win!");
        }
    }
}

module Player {

export function makePlayers(numPlayers: number) {
    var positions = ["bottom"];
    if (numPlayers > 2) {
        positions.push("left", "right");
    }
    if (numPlayers === 2 || numPlayers > 3) {
        positions.push("top");
    }
    var players: Player[] = [];
    positions.forEach(function(position) {
        var player = new Player(position);
        Util.byId("players").appendChild(player.node);
        players.push(player);
    });
    return players;
}

}

export = Player;
