import {injector} from "../factories/Injector";
import {Request} from "express";
import {ExpressServer} from "./ExpressServer";
import {GameRepository} from "../repositories/GameRepository";

export class GameCtrl {
    private static repository:GameRepository;

    constructor() {
        GameCtrl.repository = injector.getRepository("game");
    }

    @ExpressServer.RequestMapping("api/game","post")
    async registerUser(request:Request) {
        return await GameCtrl.repository.save(request.body);
    }
}