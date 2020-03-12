import { Game, HeroKind, Region } from '../model';
import { callbackify } from 'util';

export function game(socket, model: Game) {

  socket.on("moveRequest", function (id, callback) {
    console.log("Received moveRequest")
    let isAdjacent: boolean = false

    var heroID = socket.conn.id
    let hero = model.getHero(heroID);

    var newRegion = model.getRegions()[id]
    var currRegion = hero.getRegion() 
    var adjRegions = currRegion.getAdjRegionsIds()

    for(var index in adjRegions){
      var regionID = adjRegions[index]
      if(model.getRegions()[regionID] === newRegion){
        console.log("Can move from tile: ", currRegion.getID(), " to tile: ", regionID)
        isAdjacent = true
      }
    }

    // any logic for movement here
    var timeLeft = hero.getTimeOfDay() <= 7 || (hero.getTimeOfDay() <= 10 && hero.getWill() >=2)
    if (isAdjacent && timeLeft ) {
      console.log("You can move!")
      model.moveHeroTo(hero, newRegion)
      socket.broadcast.emit("moveHeroTo", heroID, newRegion.getID(), function(heroID, tileID){
          
      });
      callback(model.getHero(heroID).getKind(), (isAdjacent && timeLeft))
      
    } else {
      console.log("you cannot move here")
      // could emit event for handling failure move case here.
      //socket.emit("moveError")
    }
    //callback();
   
  });

  socket.on("moveHeroTo", function(heroType, tile, callback){
    console.log("yoink")
    callback(heroType, tile);
  })

  socket.on("pickupFarmer", function (callback) {
    let success = false;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero !== undefined) {
      success = hero.pickupFarmer();
    }
    if (success) {
      socket.broadcast.emit("updateFarmer");
      callback();
    }
  });

  socket.on('bind hero', function (heroType, callback) {
    let success = false;
    let id = socket.conn.id;

    if (heroType === "archer")
      success = model.bindHero(id, HeroKind.Archer);

    else if (heroType === "warrior")
      success = model.bindHero(id, HeroKind.Warrior);
    else if (heroType === "mage")
      success = model.bindHero(id, HeroKind.Mage);
    else if (heroType === "dwarf")
      success = model.bindHero(id, HeroKind.Dwarf);

    if (success) {
      let remaining = model.getAvailableHeros();
      let heros = {
        taken: ["archer", "warrior", "mage", "dwarf"].filter(f => !remaining.toString().includes(f)),
        remaining: remaining
      }
      socket.broadcast.emit("updateHeroList", heros)
      callback(heros);
    }

  });

  socket.on('disconnect', function () {
    console.log('user disconnected', socket.conn.id, ' in game.');
    // model.removePlayer(socket.conn.id);
  });


  /*
   * CHAT RELATED
   */
  socket.on("send message", function (sent_msg, callback) {
    console.log(socket.conn.id, "said: ", sent_msg)
    let raw_sent_msg = sent_msg
    let datestamp = getCurrentDate()
    sent_msg = "[ " + datestamp + " ]: " + sent_msg;
    model.pushToLog({ author: socket.conn.id, datestamp: datestamp, content: raw_sent_msg })
    socket.broadcast.emit("update messages", sent_msg);
    callback(sent_msg);
  });

  socket.on('removeListener', function (object) {
    console.log('removing ', object)
    socket.broadcast.emit('removeObjListener', object)
  })

  socket.on("getChatLog", function (callback) {
    callback(model.getChatLog())
  })

  socket.on('playerReady', function () {
    model.readyplayers += 1;
    console.log('ready players: ', model.readyplayers)
    socket.broadcast.emit('recieveDesiredPlayerCount', model.getNumOfDesiredPlayers())
  })

  socket.on('getReadyPlayers', function () {
    socket.broadcast.emit('sendReadyPlayers', model.readyplayers)
    socket.emit('sendReadyPlayers', model.readyplayers)
  })

  socket.on('getDesiredPlayerCount', function () {
    socket.broadcast.emit('recieveDesiredPlayerCount', model.getNumOfDesiredPlayers())
    socket.emit('recieveDesiredPlayerCount', model.getNumOfDesiredPlayers())
  })

  socket.on("dropGold", function (callback) {
    // TODO:
    callback()
  })

  socket.on("getHeros", function (callback) {
    let heros = new Array<HeroKind>();
    model.getHeros().forEach((hero, key) => { heros.push(hero.hk) });
    if (heros.length !== 0)
      callback(heros);
  })

  function getCurrentDate() {
    var currentDate = new Date();
    var day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
    var month = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
    var year = currentDate.getFullYear();
    var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }


}

