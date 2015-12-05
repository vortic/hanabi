function makeTile(color, number) {
    var tile = document.createElement("span");
    tile.className = "tile";
    tile.style.color = color;
    tile.textContent = number;
    return tile;
}

function makeTiles() {
    var colors = ["red", "white", "yellow", "green", "blue"];
    var numbers = ["1", "2", "3", "4", "5"];
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

function initializeBoard() {
    var tiles = shuffle(makeTiles());
    var players = document.getElementById("board").children;
    var numPlayers = players.length - 1;
    tiles.forEach(function(tile, idx) {
        players[(idx < 4 * numPlayers) ? (idx % numPlayers) : numPlayers].appendChild(tile);
    });
    document.getElementById("clues").textContent = "Clues: 8";
    document.getElementById("oops").textContent = "Oops remaining: 3";
}

initializeBoard();
