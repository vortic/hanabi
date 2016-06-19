import Pile = require("Pile");
import Util = require("Util");

class Tile {
    node: HTMLElement;
    numberNode: HTMLElement;
    discardNode: HTMLElement;
    clueNumber = "?";
    clueColor = "pink";
    constructor(public color: string, public number: number) {
        this.node = document.createElement("li");
        this.node.className = "tile";
        this.node.style.backgroundColor = Util.colorMap[color];
        this.numberNode = document.createElement("span");
        this.numberNode.textContent = String(this.number);
        this.node.appendChild(this.numberNode);
        this.discardNode = document.createElement("span");
        this.discardNode.className = "discard-area";
        this.discardNode.textContent = "D";
        this.node.appendChild(this.discardNode);
    }
    toggleActive(active?: boolean) {
        this.numberNode.textContent = active ? this.clueNumber : String(this.number);
        this.node.style.backgroundColor = Util.colorMap[active ? this.clueColor : this.color];
    }
    isPlayable() {
        return Pile.piles.played.highestPlayed[this.color] === this.number - 1;
    }
}

export = Tile;
