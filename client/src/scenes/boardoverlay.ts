import { Chat } from './chatwindow';
import { HeroWindow } from './herowindow';
import { WindowManager } from "../utils/WindowManager";
import { game } from '../api/game';
import { Tile } from '../objects/tile';
import { Monster } from '../objects/monster';
import { HourTracker } from '../objects/hourTracker';
import { Well } from '../objects/well';
import { reducedWidth, reducedHeight, mOffset } from '../constants';
import { HeroKind } from '../objects/HeroKind';

export default class BoardOverlay extends Phaser.Scene {
    private parent: Phaser.GameObjects.Zone
    private gameText;
    private gameinstance: game;
    private endturntext;

    // End Day
    private endDayText;
    private tiles: Tile[];
    private monsterNameMap: Map<string, Monster>;
    private hourTracker: HourTracker;
    private wells: Map<string, Well>;
    private hk: HeroKind;

    // Positioning
    private x = 0;
    private y = 0;
    private width = reducedWidth;
    private height = reducedHeight;

    constructor(data) {
        super({
            key: 'BoardOverlay'
        })
        this.gameinstance = data.gameinstance;
        this.tiles = data.tiles;
        this.monsterNameMap = data.monsterMap;
        this.hourTracker = data.hourTracker;
        this.wells = data.wells;
        this.hk = data.hk
    }

    public init() { }

    public preload() {
        this.load.image('hourbar', './assets/hours.PNG')
    }

    public create() {
        // Set the overlay as a top bar on the game
        this.parent = this.add.zone(this.x, this.y, this.width, this.height).setOrigin(0);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.width, this.height);

        var self = this;

        var style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            backgroundColor: '#f00'
        }
        
        this.gameinstance.getHeros((heros) =>{
            heros.forEach(type => {
                if (type === "mage") {
                  // Your profile.
                    this.gameText = this.add.text(400, 10, "Mage", style2)
                    this.gameText.setInteractive();
                    this.gameText.on('pointerdown', function (pointer) {

                    this.gameinstance.getHeroAttributes("Mage", (herodata) => {
                    
                        if (this.scene.isVisible('mageCard')) {
                            var thescene = WindowManager.get(this, 'mageCard')
                            thescene.disconnectListeners()
                            WindowManager.destroy(this, 'mageCard');
                        } else {
                            console.log(self.gameinstance)
                            WindowManager.create(this, 'mageCard', HeroWindow,{controller: self.gameinstance, icon: 'weed',clienthero:self.hk,windowhero:'mage', ...herodata});
                            let window = WindowManager.get(this, 'mageCard')
                            window.setName('Mage')
                        }
                    })

                    }, this);
                }else if (type === "archer") {
                  //Other player's icons.
                    this.gameText = this.add.text(300, 10, "Archer", style2)
                    this.gameText.setInteractive();
                    this.gameText.on('pointerdown', function (pointer) {
                        this.gameinstance.getHeroAttributes("Archer", (herodata) => {
                    
                            if (this.scene.isVisible('archerCard')) {
                                var thescene = WindowManager.get(this, 'archerCard')
                                thescene.disconnectListeners()
                                WindowManager.destroy(this, 'archerCard');
                            } else {
                                console.log(self.gameinstance)
                                WindowManager.create(this, 'archerCard', HeroWindow,{controller: self.gameinstance, icon: 'weed',clienthero:self.hk,windowhero:'archer', ...herodata});
                                let window = WindowManager.get(this, 'archerCard')
                                window.setName('Archer')
                            }
                        })
                    }, this);
                } else if (type === "warrior") {
                    this.gameText = this.add.text(200, 10, "Warrior", style2)
                    this.gameText.setInteractive();
                    this.gameText.on('pointerdown', function (pointer) {
                        this.gameinstance.getHeroAttributes("Warrior", (herodata) => {
                    
                            if (this.scene.isVisible('warriorCard')) {
                                var thescene = WindowManager.get(this, 'warriorCard')
                                thescene.disconnectListeners()
                                WindowManager.destroy(this, 'warriorCard');
                            } else {
                                console.log(self.gameinstance)
                                WindowManager.create(this, 'warriorCard', HeroWindow,{controller: self.gameinstance, icon: 'weed',clienthero:self.hk,windowhero:'warrior', ...herodata});
                                let window = WindowManager.get(this, 'warriorCard')
                                window.setName('Warrior')
                            }
                        })
                    }, this);
                } else if (type === "dwarf") {
                    this.gameText = this.add.text(100, 10, "Dwarf", style2)
                    this.gameText.setInteractive();
                    this.gameText.on('pointerdown', function (pointer) {
                        this.gameinstance.getHeroAttributes("Dwarf", (herodata) => {
                    
                            if (this.scene.isVisible('dwarfCard')) {
                                var thescene = WindowManager.get(this, 'dwarfCard')
                                thescene.disconnectListeners()
                                WindowManager.destroy(this, 'dwarfCard');
                            } else {
                                console.log(self.gameinstance)
                                WindowManager.create(this, 'dwarfCard', HeroWindow, {controller: self.gameinstance, icon: 'weed',clienthero:self.hk,windowhero:'dwarf', ...herodata});
                                let window = WindowManager.get(this, 'dwarfCard')
                                window.setName('Dwarf')
                            }
                        })
                    }, this);
                }
              });
        })

        //Options
        var optionsIcon = this.add.image(30, 30, 'optionsIcon').setInteractive();
        optionsIcon.setScale(0.5)
        optionsIcon.on('pointerdown', function (pointer) {
            this.sys.game.scene.bringToTop('Options')
            this.sys.game.scene.getScene('Options').scene.setVisible(true, 'Options')
            this.scene.resume('Options')
        }, this);

        // chat window
        this.gameText = this.add.text(750, 560, "CHAT", style2)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            console.log(this.scene, ' in overlay')
            if (this.scene.isVisible('chat')) {
                WindowManager.destroy(this, 'chat');
            }
            else {
                console.log(self.gameinstance)
                WindowManager.create(this, 'chat', Chat, { controller: self.gameinstance });
            }
        }, this);

        // end turn button
        this.endturntext = this.add.text(850, 560, "END TURN", style2)
        this.endturntext.setInteractive();
        this.endturntext.on('pointerdown', function (pointer){
            if (this.gameinstance.myTurn) {
                this.gameinstance.endTurn();
                this.tweens.add({
                    targets: this.endturntext,
                    alpha: 0.3,
                    duration: 350,
                    ease: 'Power3',
                    yoyo: true
                });
        
            }
        }, this)

        // end day setup
        this.endDaySetup();
    }
  
    private endDaySetup() {
        var self = this;

        var style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            backgroundColor: '#f00'
        }
    
        this.endDayText = this.add.text(600, 560, "END DAY", style2)
        this.endDayText.setInteractive();
        this.endDayText.on('pointerdown', function (pointer) {
            // does nothing if not your turn
            if (!self.gameinstance.getTurn()) {
                console.log("cannot end your day when it is not your turn");
                return;
            }

            self.gameinstance.endDay(function(all: boolean) {
                // Update this client's turn state
                self.gameinstance.endTurnOnEndDay();
                // the last client to end their day triggers end of day actions for everyone
                if (all) {
                    self.gameinstance.moveMonstersEndDay();
                    // Reset wells
                    self.gameinstance.resetWells(replenishWellsClient);
                }
            });
        }, this);
    
        // Callbacks
        // Server handles logic for whose hours are getting reset
        self.gameinstance.receiveResetHours(resetHeroHours);

        self.gameinstance.receiveUpdatedMonsters(moveMonstersOnMap);
        function moveMonstersOnMap(updatedMonsters) {
            console.log("Received updated monsters from server");
            self.moveMonstersEndDay(updatedMonsters);
        }
    
        self.gameinstance.receiveKilledMonsters(deleteKilledMonsters);
        function deleteKilledMonsters(killedMonster) {
            self.removeKilledMonsters(killedMonster)
        }
    
        self.gameinstance.fillWells(replenishWellsClient);
        function replenishWellsClient(replenished: number[]) {
            console.log("well tile ids to replenish:", replenished);
            for (let id of replenished) {
                self.wells.get(""+id).fillWell();
            }
        }
    
        self.gameinstance.receiveResetHours(resetHeroHours);
        function resetHeroHours(resetHoursHk: string) {
            console.log("resetting hourtracker for", resetHoursHk)
            // Note: we don't keep track of hero hours on client, so only need to update 
            // visual hourTracker
            var hk;
            switch (resetHoursHk) {
                case "archer":
                    hk = HeroKind.Archer;
                    break;
                case "dwarf":
                    hk = HeroKind.Dwarf;
                    break;
                case "mage":
                    hk = HeroKind.Mage;
                    break;
                default:
                    hk = HeroKind.Warrior;
            }
            self.hourTracker.reset(hk);
        }
    }
  
  
    private moveMonstersEndDay(updatedMonsters) {
      for (const [mName, newTileID] of Object.entries(updatedMonsters)) {
        let newTile = this.tiles[newTileID as number];
        this.monsterMoveTween(this.monsterNameMap[mName], newTile, newTile.x, newTile.y);
      }
    }
  
    private removeKilledMonsters(m) {
      let monster = this.monsterNameMap[m]
      monster.tile.monster = null
      monster.destroy()
      this.monsterNameMap[m] = null
    }
  
    public monsterMoveTween(monster: Monster, newTile: Tile, newX, newY) {
      this.tweens.add({
        targets: monster,
        x: newX + mOffset,
        y: newY,
        duration: 1000,
        ease: 'Power2',
        completeDelay: 1000,
        onComplete: function() {monster.moveToTile(newTile)}
      });
      
    }
}