import Tile = require("Tile");
import Util = require("Util");

class Pile {
    node: HTMLElement;
    tiles: Tile[] = [];
    highestPlayed: {[color: string]: number};
    colors: {[color: string]: HTMLElement} = {};
    constructor(public name: string) {
        this.node = Util.byId(name);
        this.highestPlayed = {};
        Util.colors.forEach((color) => {
            this.highestPlayed[color] = 0;
        });
        Util.colors.forEach((color) => {
            var playedColor = document.createElement("div");
            playedColor.className = "pile";
            playedColor.style.color = color;
            var playedColorName = document.createElement("div");
            playedColorName.textContent = color;
            playedColor.appendChild(playedColorName);
            this.colors[color] = playedColor;
            this.node.appendChild(playedColor);
        });
    }
}

module Pile {

export interface Piles {
    middle: Pile;
    played: Pile;
    discarded: Pile;
}

export var piles = {
    middle: new Pile("middle"),
    played: new Pile("played"),
    discarded: new Pile("discarded")
}

}

export = Pile;
