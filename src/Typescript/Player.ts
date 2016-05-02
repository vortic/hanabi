import Pile = require("Pile");
import Server = require("Server");
import Tile = require("Tile");
import Util = require("Util");

class Player {
    node: HTMLElement;
    handNode: HTMLElement;
    tiles: Tile[] = [];
    constructor(public position: string, public index: number) {
        this.node = document.createElement("div");
        this.node.className = "hand " + this.position;
        var positionNode = document.createElement("div");
        positionNode.textContent = this.position;
        this.node.appendChild(positionNode);
        this.handNode = document.createElement("ul");
        this.node.appendChild(this.handNode);
    }
    myTurn(yes = true) {
        this.tiles.forEach((tile) => {
            tile.toggleActive(yes);
            tile.node.onclick = yes
                ? (event) => {
                    this.playTile(tile, event.target === tile.discardNode);
                }
                : () => {
                    this.receiveClue(tile, event.target === tile.discardNode);
                };
        });
    }
    addTile(tile: Tile) {
        tile.node.classList.remove("played");
        this.tiles.push(tile);
        this.handNode.appendChild(tile.node);
        tile.node.onclick = (event) => {
            this.receiveClue(tile, event.target === tile.discardNode);
        };
    }
    removeTile(tile: Tile) {
        tile.toggleActive(false);
        tile.node.onclick = null;
        tile.discardNode.classList.add("hidden");
    }
    playTile(tile: Tile, discard = false) {
        if (this.index !== Server.currentPlayer) {
            return;
        }
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
        } else if (Util.numOops === 0) {
            alert("You lose!");
        }
        Server.turnTaken({
            player: this,
            tile,
            discard
        });
    }
    receiveClue(tile: Tile, color: boolean) {
        var indices: number[] = [];
        this.tiles.forEach((t, i) => {
            var canClue = false;
            if (color && t.color === tile.color) {
                t.clueColor = tile.color;
                canClue = true;
            }
            if (! color && t.number === tile.number) {
                t.clueNumber = String(tile.number);
                canClue = true;
            }
            if (canClue) {
                indices.push(i);
            }
        });
        Util.giveClue();
        Server.turnTaken({
            player: this,
            tile,
            clueType: color ? tile.color : tile.number,
            indices
        });
    }
}

module Player {

export function makePlayers(numPlayers: number) {
    var positions = ["bottom"];
    if (numPlayers > 2) {
        positions.push("left", "right");
    }
    if (numPlayers === 2) {
        positions.push("top");
    }
    if (numPlayers > 3) {
        positions.splice(2, 0, "top");
    }
    var players: Player[] = [];
    positions.forEach(function(position, idx) {
        var player = new Player(position, idx);
        Util.byId("players").appendChild(player.node);
        players.push(player);
    });
    return players;
}

}

export = Player;
