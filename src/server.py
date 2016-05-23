import flask
from flask import Flask, request, url_for
app = Flask(__name__)

def to_json(obj):
    return flask.jsonify(**obj.to_json())

class IdObject(object):
    next_id = 0
    
    @staticmethod
    def set_id(entity, instance):
        instance.id = entity.next_id
        entity.next_id += 1
        
    def to_json(self):
        return vars(self)

class Game(IdObject):
    def __init__(self, num_players=4):
        IdObject.set_id(Game, self)
        self.clues = 8
        self.oops = 3
        self.tiles = {}
        for color in ["red", "white", "yellow", "green", "blue"]:
            for number in xrange(1, 6):
                tile = Tile(color, number)
                self.tiles[tile.id] = tile
        self.players = [Player() for i in xrange(num_players)]
        self.current_player = self.players[0].id
        self.played = []
        self.discarded = []
    
    def play_tile(self, tile_id, discard=False):
        (self.discarded if discard else self.played).append(self.tiles[tile_id])
        
    def clue(self, player_id, clue):
        print clue
        # TODO
    
    def to_json(self):
        json = {
            "id": self.id,
            "clues": self.clues,
            "oops": self.oops,
            "currentPlayer": self.current_player,
        }
        json["players"] = [player.to_json() for player in self.players]
        json["played"] = [tile.to_json() for tile in self.played]
        json["discarded"] = [tile.to_json() for tile in self.discarded]
        return json

class Player(IdObject):
    def __init__(self):
        IdObject.set_id(Player, self)
        self.tiles = []

class Tile(IdObject):
    def __init__(self, color, number):
        IdObject.set_id(Tile, self)
        self.color = color
        self.number = number
        self.clue_color = None
        self.clue_number = None


games = {}

def get_game(game_id):
    if game_id not in games:
        flask.abort(404)
    return games[game_id]

@app.route("/games", methods=["POST"])
def new_game():
    game = Game()
    games[game.id] = game
    return get_state(game.id)

@app.route("/games/<int:game_id>")
def get_state(game_id):
    return to_json(get_game(game_id))

@app.route("/games/<int:game_id>/play/<int:tile_id>", methods=["POST"])
def play(game_id, tile_id):
    game = get_game(game_id)
    game.play_tile(tile_id)
    return to_json(game)

@app.route("/games/<int:game_id>/discard/<int:tile_id>", methods=["POST"])
def discard(game_id, tile_id):
    game = get_game(game_id)
    game.play_tile(tile_id, True)
    return to_json(game)

@app.route("/games/<int:game_id>/clue/<int:player_id>", methods=["POST"])
def clue(game_id, player_id):
    game = get_game(game_id)
    game.clue(player_id, request.json["clue"])
    return to_json(game)

if __name__ == "__main__":
    app.run(debug=True)
