// taken from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function byId(id) {
    return document.getElementById(id);
}

function makeTile(color, number) {
    var tile = document.createElement("span");
    tile.className = "tile";
    tile.style.color = color;
    tile.textContent = number;
    return tile;
}

function makeTiles() {
    var tiles = [];
    colors.forEach(function(color) {
        numbers.forEach(function(number) {
            var copies = number === "1" ? 3 : number === "5" ? 1 : 2;
            for (var i = 0; i < copies; i++) {
                tiles.push(makeTile(color, number));
            }
        });
    });
    return tiles;
}

function makePlayer(name) {
    var player = document.createElement("div");
    player.className = "tiles " + name;
    var type = document.createElement("div");
    type.textContent = name;
    player.appendChild(type);
    return player;
}

function makePlayers(numPlayers) {
    var types = ["bottom"];
    if (numPlayers > 2) {
        types.push("left", "right");
    }
    if (numPlayers === 2 || numPlayers > 3) {
        types.push("top");
    }
    var players = [];
    types.forEach(function(type) {
        var player = makePlayer(type);
        byId("players").appendChild(player);
        player.tiles = [];
        player.playTile = function(piles, idx, discard) {
            var toPlay = player.tiles[idx];
            toPlay.parentNode.removeChild(toPlay);
            player.tiles.splice(idx, 1);
            var toGive = piles.middle.tiles.pop();
            if (toGive) {
                toGive.parentNode.removeChild(toGive);
                player.tiles.push(toGive);
                player.appendChild(toGive);
                var next = piles.middle.tiles[piles.middle.tiles.length - 1];
                byId("nextPlay").style.color = next.style.color;
                byId("nextPlay").textContent = next.textContent;
            }
            var playable = isPlayable(toPlay, piles.played);
            var color = toPlay.style.color;
            byId("lastPlay").style.color = color;
            byId("lastPlay").textContent = toPlay.textContent;
            byId("valid").textContent = playable;
            var pile = piles[discard || ! playable ? "discarded" : "played"];
            pile.colors[color].appendChild(toPlay);
            pile.tiles.push(toPlay);
            if (playable) {
                piles.played.highestPlayed[color]++;
            }
            return playable;
        };
        players.push(player);
    });
    return players;
}

function makePiles() {
    var piles = {};
    ["middle", "played", "discarded"].forEach(function(name) {
        piles[name] = byId(name);
        if (name === "played") {
            piles[name].highestPlayed = {};
            colors.forEach(function(color) {
                piles[name].highestPlayed[color] = 0;
            });
        }
        var pile = piles[name];
        pile.colors = {};
        colors.forEach(function(color) {
            var playedColor = document.createElement("div");
            playedColor.className = "pile";
            playedColor.style.color = color;
            var playedColorName = document.createElement("div");
            playedColorName.textContent = color;
            playedColor.appendChild(playedColorName);
            pile.colors[color] = playedColor;
            pile.appendChild(playedColor);
        });
        pile.tiles = [];
    });
    return piles;
}

function isPlayable(tile, played) {
    return played.highestPlayed[tile.style.color] === +tile.textContent - 1;
}

function initializeBoard(numPlayers) {
    var tiles = shuffle(makeTiles());
    var players = makePlayers(numPlayers);
    var piles = makePiles();

    tiles.forEach(function(tile, idx) {
        var isPlayer = idx < 4 * numPlayers;
        var pile = (isPlayer ? players[idx % numPlayers] : piles.middle);
        pile.tiles.push(tile);
        (isPlayer ? pile : pile.colors[tile.style.color]).appendChild(tile);
    });

    var score = 0;
    var numClues = 8;
    var numOops = 3;
    byId("score").textContent = "Score: " + score;
    byId("clues").textContent = "Clues: " + numClues;
    byId("oops").textContent = "Oops remaining: " + numOops;

    byId("play").onclick = function() {
        if (! players[0].playTile(piles, 0)) {
            numOops--;
            byId("oops").textContent = "Oops remaining: " + numOops;
        } else {
            score++;
            byId("score").textContent = "Score: " + score;
        }

    };
    byId("discard").onclick = function() {
        players[0].playTile(piles, 0, true);
        numClues = Math.min(8, numClues + 1);
        byId("clues").textContent = "Clues: " + numClues;
    };
    byId("clue").onclick = function() {
        numClues = Math.max(0, numClues - 1);
        byId("clues").textContent = "Clues: " + numClues;
    };

    // for debugging
    var next = piles.middle.tiles[piles.middle.tiles.length - 1];
    byId("nextPlay").style.color = next.style.color;
    byId("nextPlay").textContent = next.textContent;
}

var colors = ["red", "white", "yellow", "green", "blue"];
var numbers = ["1", "2", "3", "4", "5"];
initializeBoard(4);
