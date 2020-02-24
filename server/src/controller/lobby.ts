import { Lobby, Game, GameDifficulty } from '../model';
import { game } from './game';

export function lobby(socket, model: Lobby, io) {
  socket.on("createGame", function (name, numPlayers, difficulty) {
    const d = difficulty === "Easy" ? GameDifficulty.Easy : GameDifficulty.Hard;
    let g = new Game(name, numPlayers, d);
    model.createGame(g);
    console.log("Created game", name)
    // TODO create namespace for game instance and connect it to socket.io
    
    var gamensp = io.of("/" + name)
    console.log('xxxxxxxxxxxxxxxxx', name)
    gamensp.on("connection", function (socket) {
      console.log('we in dis')
      game(socket, g)
    });
  })

  socket.on("getGames", function(callback){
    callback(Array.from(model.getAvailableGames().keys()))
  })
 
  socket.on("newPlayer", function () {
    let id = model.connectNewPlayer(socket.conn.id)
    console.log(model.getPlayers());
  });

  socket.on('disconnect', function (x) {
    let id = socket.conn.id
    model.disconnectPlayer(socket.conn.id)
    console.log('Lobby disconnected', id);
  });

  socket.on('bind hero', function(herotype) {
    console.log('player ', socket.conn.id, ' chose ', herotype)
  });
}
