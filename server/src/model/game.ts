import { GameDifficulty } from "./GameDifficulty"
import { RietburgCastle } from "./RietburgCastle"
import { Farmer } from "./Farmer"
import { Region } from "./region"
//import fs = require('fs');
export class Game {
    
    private numOfDesiredPlayers: number;
    private difficulty: GameDifficulty;
    private castle: RietburgCastle;
    private name: string;
    private chatlog: any;
    private regions: any;

    constructor(name: string, numOfDesiredPlayers: number, difficulty: GameDifficulty){
        this.name = name;
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.castle = new RietburgCastle();
        this.chatlog = [];
        this.regions = [];
        this.setRegions();
    }

    private setRegions() {
        let rawdata = require('fs').readFileSync(require('path').resolve('src/model/tilemap.json'));
        let student = JSON.parse(rawdata.toString());
    }

    public getName(): string {
        return this.name;
    }

    public removeFarmer(f: Farmer){
        //TO BE IMPLEMENTED
    }

    private endGame(){
        //TO BE IMPLEMENTED
    }

    private checkMonsterInRietburg(){
        //TO BE IMPLEMENTED
    }

    private checkForFarmer(tile: Region){
        //TO BE IMPLEMENTED
    }

    private checkHeroOnWellTile(){
        //TO BE IMPLEMENTED
    }

    private replenishWell(){
        //TO BE IMPLEMENTED
    }

    private incrementNarratorPosition(){
        //TO BE IMPLEMENTED
    }

    public pushToLog(item) {
        this.chatlog.push(item)
    }

    public getChatLog() {
        return this.chatlog;
    }
}