import Pile = require("Pile");
import Player = require("Player");
import Tile = require("Tile");
import Util = require("Util");

class HttpClient {
    request(params: {
        url: string;
        method: string;
        content?: string;
        success?: (responseText: string) => void;
        error?: () => void;
    }) {
        params.content = params.content || "";
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    params.success && params.success(httpRequest.responseText);
                } else {
                    params.error && params.error();
                }
            }
        };
        httpRequest.open(params.method, params.url + (params.method === "GET" ? params.content : ""));
        httpRequest.send(params.method === "GET" ? null : params.content);
    }
}

export var currentPlayer: number;
var players: Player[];
var tilesRemaining: number;
var turnsRemaining: number;
var client = new HttpClient();
var BASE_URL = "http://127.0.0.1:5000/games";

interface ServerTile {
    id: number;
    color: string;
    number: number;
    clue_color: string;
    clue_number: string;
}

interface GameState {
    numClues: number,
    numOops: number,
    score: number,
    currentPlayer: number,
    players: {
        id: number,
        tiles: ServerTile[]
    }[],
    played: ServerTile[],
    discarded: ServerTile[],
    remaining: ServerTile[]
}

export function init(numPlayers: number) {
    client.request({
        url: BASE_URL + "/0",
        method: "GET",
        content: "",
        success: (responseText: string) => {
            var json = <GameState>JSON.parse(responseText);
            console.log(json);
            players = Player.makePlayers(numPlayers);
            updateGameState(json);
        },
        error: () => {
            // 404--try to get a new game, then try again
            client.request({
                url: BASE_URL,
                method: "POST",
                success: () => {
                    init(numPlayers);
                }
            })
        }
    });
}

function updateGameState(json: GameState) {
    var piles = Pile.piles;

    json.players.forEach((player, i) => {
        player.tiles.forEach(t => {
            players[i].addTile(new Tile(t.color, t.number));
        });
    });
    json.remaining.forEach(t => {
        piles.middle.addTile(new Tile(t.color, t.number));
    });

    // for debugging
    Util.updateNext(piles.middle.tiles[piles.middle.tiles.length - 1]);

    Util.byId("score").textContent = String(json.score);
    Util.byId("clues").textContent = String(json.numClues);
    Util.byId("oops").textContent = String(json.numOops);

    currentPlayer = json.currentPlayer;
    tilesRemaining = Pile.piles.middle.tiles.length;
    turnsRemaining = players.length;
    players[currentPlayer].myTurn();
    Util.byId("current-player").textContent = players[currentPlayer].position;
}

interface TurnInfo {
    player: Player;
    tile: Tile;
    discard?: boolean;
    // the number or color being clued
    clueType?: number|string;
    // which tile(s) the clue applies to
    indices?: number[];
}

export function turnTaken(turnInfo: TurnInfo) {
    var turn = document.createElement("div");
    turn.className += "log-row";
    turn.textContent = players[currentPlayer].position + " "
            + (turnInfo.clueType
                    ? "clued " + turnInfo.player.position + " on "
                    : turnInfo.discard ? "discarded" : "played") + " ";
    if (turnInfo.tile) {
        var clueOnNumber = typeof(turnInfo.clueType) === "number";
        var clueOnColor = typeof(turnInfo.clueType) === "string";
        var textContent = String(turnInfo.tile.number);
        if (clueOnColor) {
            textContent = turnInfo.tile.color;
        }
        if (turnInfo.clueType) {
            textContent +=
                    " ("
                    + turnInfo.indices.map(i => ["first", "second", "third", "fourth"][i]).join(", ")
                    + " tile)";
        }
        var color = Util.colorMap[turnInfo.tile.color];
        var tileDescription = document.createElement("span");
        if (clueOnNumber) {
            color = "";
            tileDescription.className = "inline-tile-blank";
        } else {
            tileDescription.className = "inline-tile" + (Util.colorMap["white"] === color ? " font-color-black" : "");
        }
        tileDescription.textContent = textContent;
        tileDescription.style.backgroundColor = color;
        turn.appendChild(tileDescription);
    }
    Util.byId("turn-log").appendChild(turn);
    players[currentPlayer].myTurn(false);
    currentPlayer = (currentPlayer + 1) % players.length;
    Util.byId("current-player").textContent = players[currentPlayer].position;
    players[currentPlayer].myTurn();
    if (! turnInfo.clueType) {
        tilesRemaining = Math.max(0, tilesRemaining - 1);
    }
    if (tilesRemaining === 0) {
        turnsRemaining--;
    }
    if (turnsRemaining < 0) {
        if (Util.score >= 25) {
            alert("You win!");
        } else {
            alert("You lose! (Out of time)");
        }
    }
}
