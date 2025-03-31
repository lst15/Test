import {Game} from "../models/GameModel";
import mongoose from "mongoose";

interface IGame {
    userID: any,
    gameDate: any,
    failed: any,
    difficulty: any,
    completed: any,
    timeTaken: any
}

export class GameRepository {

    public async save(game:IGame) {
        const model = new Game({...game})
        return model.save();
    }

    public async history(userID:string) {
        return await Game.find().exec();
    }

}