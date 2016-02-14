import Pile = require("Pile");
import Util = require("Util");

class Tile {
    node: HTMLElement;
    numberNode: HTMLElement;
    discardNode: HTMLElement;
    constructor(public color: string, public number: number) {
        this.node = document.createElement("span");
        this.node.className = "tile";
        this.node.style.color = Util.colorMap[color];
        this.numberNode = document.createElement("span");
        this.numberNode.textContent = String(this.number);
        this.node.appendChild(this.numberNode);
        this.discardNode = document.createElement("span");
        this.discardNode.className = "discard-area";
        this.discardNode.textContent = "D";
        this.node.appendChild(this.discardNode);
    }
    toggleActive(active?: boolean) {
        this.node.classList.toggle("action", active);
        this.numberNode.textContent = active ? "?" : String(this.number);
        this.node.style.color = active ? "pink" : Util.colorMap[this.color];
    }
    isPlayable() {
        return Pile.piles.played.highestPlayed[this.color] === this.number - 1;
    }
}

module Tile {

export var tiles: Tile[] = [];
Util.colors.forEach(function(color) {
    Util.numbers.forEach(function(num) {
        var copies = num === 1 ? 3 : num === 5 ? 1 : 2;
        for (var i = 0; i < copies; i++) {
            tiles.push(new Tile(color, num));
        }
    });
});

}

export = Tile;
