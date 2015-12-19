import Util = require("Util");

class Tile {
    node: HTMLElement;
    constructor(public color: string, public number: number) {
        this.node = document.createElement("span");
        this.node.className = "tile";
        this.node.textContent = String(this.number);
        this.node.style.color = color;
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
