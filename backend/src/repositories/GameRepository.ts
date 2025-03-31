import {Game} from "../models/GameModel";

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

}