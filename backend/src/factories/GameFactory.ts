import {UserRepository} from "../repositories/UserRepository";
import {injector} from "./Injector";
import {GameRepository} from "../repositories/GameRepository";

export class GameFactory {
    static loadRepository()  {
        const repository = new GameRepository();
        injector.registerRepository("game", repository);
    }
}