import { lobby } from "../api/lobby";
import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { reducedWidth, reducedHeight } from "../constants";

export default class JoinGameScene extends Phaser.Scene {

    private lobbyController: lobby;
    private gameNames: string[] = [];
    private gameButtonsMap: Map<string, RoundRectangle> = new Map();
    private gameChoice: string;

    constructor() {
        super({key: 'Join'});
    }

    //HTML
    public preload() {
        // this.load.html('joinscreen', './assets/templates/joinscreen.html');
    }

    public init(data){
        this.lobbyController = data.controller;
        // this.gameNames = []
        // var self = this;
    }

    //create the join screen
    public create() {
        var self = this;
        
        //adding background via picture fantasyhome
        //consult lobby.ts for fantasyhome inclusion
        //titleStyle, may need to add shadowing for better visibility
        //regularTextStyle, for other texts
        var background = this.add.image(500,300,'fantasyhome').setDisplaySize(1000,600)
        var titleStyle = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "50px",
            color: '#4b5c09',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 5,
                stroke: true,
                fill: true
            }
         }
        var regularTextStyle = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "23px",
            color: '#89B4B3',
            shadow: {
                offsetX: 5,
                offsetY: 2,
                color: '#000',
                blur: 4,
                stroke: true,
                fill: true
            }
        }

        //putting Join Game on the screen 
        var gameText = this.add.text(500,100,"Join Game",titleStyle).setOrigin(0.5)

        //putting select title on the screen just below join game and move left
        var title = this.add.text(110, 165, 'Select from existing games:', regularTextStyle);

        let mainColour = 0xffff00
        let backColour = 0x333333
        var numTextStyle = {
            color: mainColour,
            fontSize: '30px'
        }
        let currX = 110

        this.lobbyController.getGames( function(games) {
            console.log(games);
            self.gameNames = games;

            self.gameNames.forEach( name => {
                var gamePanelBg = new RoundRectangle(self, currX, 250, 86, 66, 10, mainColour);
                gamePanelBg.visible = false;
                self.add.existing(gamePanelBg);
                var gamePanel = new RoundRectangle(self, currX, 250, 80, 60, 10, backColour);
                self.add.existing(gamePanel);
                var nameButton = self.add.text(currX, 250, name, numTextStyle).setOrigin(0.5);
                // gamePanel.setInteractive().on('pointerdown', () => {
                //     // toggle function
                // })
                nameButton.setInteractive().on('pointerdown', () => {
                    // toggle function
                    toggleChoice(name)
                })
                self.gameButtonsMap.set(name, gamePanelBg);
                currX += 100
            })
        })

        function toggleChoice(name: string) {
            console.log('toggle', name)
            this.gameChoice = name;
            self.gameButtonsMap.forEach((bg, bgName) => {
                if (name == bgName) {
                    bg.visible = true;
                } else {
                    bg.visible = false;
                }
            })
        }


        // //HTML - modify 'joinscreen' for HTML file 
        // var element = this.add.dom(410, 200).createFromCache('joinscreen');
        
        // this.gameNames.forEach(e => {
        //     let form = element.getChildByName("Choose Game")
        //     form.innerHTML = form.innerHTML + '<option value="'+ e + '">' + e + '</option>'
        // });

        // var self = this;

        // //for clicking, Join Game
        // element.addListener('click');
        // element.on('click', function (event) {
        //     if (event.target.name === 'submitButton')
        //     {
        //         //player must select a game to join game
        //         var selectedOption = this.getChildByName('Choose Game');
        //         var gamename = selectedOption.options[selectedOption.selectedIndex].text
        //         //  Have they entered anything?
        //         if (selectedOption.value !== '')
        //         {
        //             self.lobbyController.addPlayerToGame(gamename, null);
        //             self.scene.start('Ready', {name: gamename})
        //         }
        //     }
        // });

        //go back
        var gobackbtn = this.add.sprite(80, 475, 'goback').setInteractive().setScale(0.5)
        gobackbtn.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);
    }

    //transition into Ready scene.
    public changescene() {
        this.scene.start('Ready')
    }

    public update() {

    }
}