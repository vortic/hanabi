from datetime import timedelta
import flask
from flask import current_app, Flask, make_response, request, url_for
from functools import update_wrapper
from random import shuffle
app = Flask(__name__)

"""
crossdomain decorator
(courtesy of: https://blog.skyred.fi/articles/better-crossdomain-snippet-for-flask.html)
"""
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

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
        self.num_players = num_players
        self.clues = 8
        self.oops = 3
        self.score = 0
        self.tiles = {} # tile_id -> Tile
        self.highest_played = {} # color -> highest played number of that color
        for color in ["red", "white", "yellow", "green", "blue"]:
            self.highest_played[color] = 0
            for number in xrange(1, 6):
                for _copy in xrange(3 if number == 1 else 1 if number == 5 else 2):
                    tile = Tile(color, number)
                    self.tiles[tile.id] = tile
        self.players = [Player() for i in xrange(num_players)]
        self.current_player = self.players[0].id
        # these are lists of Tiles
        self.played = []
        self.discarded = []
        self.remaining = []
        # distribute tiles
        tile_ids = self.tiles.keys()
        shuffle(tile_ids)
        for i, tile_id in enumerate(tile_ids):
            (self.players[i % num_players].tiles
                if i < (4 if num_players > 3 else 5) * num_players else
             self.remaining
            ).append(self.tiles[tile_id])

    def to_json(self):
        return {
            "id": self.id,
            "numClues": self.clues,
            "numOops": self.oops,
            "score": self.score,
            "currentPlayer": self.current_player,
            "players": [player.to_json() for player in self.players],
            "played": [tile.to_json() for tile in self.played],
            "discarded": [tile.to_json() for tile in self.discarded],
            "remaining": [tile.to_json() for tile in self.remaining]
        }

    def get_player(self, player_id=None):
        if player_id == None:
            player_id = self.current_player
        # TODO this only works for the first game initialized
        return self.players[player_id]

    def next_player(self):
        # TODO this only works for the first game initialized
        self.current_player = (self.current_player + 1) % self.num_players

    def play_tile(self, tile_id, discard=False):
        tile = self.tiles[tile_id]
        if tile not in self.get_player().tiles:
            flask.abort(404)
        pile = self.discarded
        if discard:
            self.clues = max(8, self.clues + 1)
        elif tile.number == self.highest_played[tile.color] + 1:
            pile = self.played
        else:
            self.oops = min(0, self.oops - 1)
        pile.append(tile)
        self.next_player()

    def clue(self, player_id, clue):
        indices = self.get_player(player_id).receive_clue(clue)
        if len(indices) == 0:
            flask.abort(404)
        self.next_player()

class Player(IdObject):
    def __init__(self):
        IdObject.set_id(Player, self)
        self.tiles = []

    def __str__(self):
        return str(self.id)

    def to_json(self):
        return {
            "id": self.id,
            "tiles": [tile.to_json() for tile in self.tiles]
        }

    def receive_clue(self, clue):
        indices = []
        for i, tile in enumerate(self.tiles):
            if type(clue) == int:
                if tile.number == clue:
                    tile.clue_number = clue
                    indices.append(i)
            elif type(clue) == str:
                if tile.color == clue:
                    tile.clue_color = clue
                    indices.append(i)
        return indices

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
@crossdomain("*")
def get_state(game_id):
    print game_id
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
def give_clue(game_id, player_id):
    clue = request.json["clue"]
    if type(clue) != int and type(clue) != str:
        flask.abort(404)
    game = get_game(game_id)
    game.clue(player_id, clue)
    return to_json(game)

if __name__ == "__main__":
    app.run(debug=True)
