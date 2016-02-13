import Player = require("Player");
import Util = require("Util");

class Server {
    currentPlayer: number;
    constructor(public numPlayers: number, public players: Player[]) {
        this.currentPlayer = 0;
    }
    turnTaken() {
        this.currentPlayer = (this.currentPlayer + 1) % this.numPlayers;
        Util.byId("current-player").textContent = "Current Player: "
            + this.players[this.currentPlayer].position;
    }
}

export var server: Server;

export function init(numPlayers: number, players: Player[]) {
    server = new Server(numPlayers, players);
}

export function turnTaken() {
    server.turnTaken();
}

export function currentPlayer() {
    return server.currentPlayer;
}
