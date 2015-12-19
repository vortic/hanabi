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
    playTile(piles: Pile.Piles, idx: number, discard = false) {
        var toPlay = this.tiles[idx];
        toPlay.node.parentNode.removeChild(toPlay.node);
        this.tiles.splice(idx, 1);
        var toGive = piles.middle.tiles.pop();
        if (toGive) {
            toGive.node.parentNode.removeChild(toGive.node);
            this.tiles.push(toGive);
            this.node.appendChild(toGive.node);
            var next = piles.middle.tiles[piles.middle.tiles.length - 1];
            Util.byId("nextPlay").style.color = next.node.style.color;
            Util.byId("nextPlay").textContent = next.node.textContent;
        }
        var playable = Util.isPlayable(toPlay, piles.played);
        var color = toPlay.node.style.color;
        Util.byId("lastPlay").style.color = color;
        Util.byId("lastPlay").textContent = toPlay.node.textContent;
        Util.byId("valid").textContent = String(playable);
        var pile = discard || ! playable ? piles.discarded : piles.played;
        pile.colors[color].appendChild(toPlay.node);
        pile.tiles.push(toPlay);
        if (playable) {
            piles.played.highestPlayed[color]++;
        }
        return playable;
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
