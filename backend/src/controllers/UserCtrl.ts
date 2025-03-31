import {UserRepository} from "../repositories/UserRepository";
import {injector} from "../factories/Injector";
import {Request} from "express";
import {ExpressServer} from "./ExpressServer";

export class UserCtrl {
    private static repository:UserRepository;

    constructor() {
        UserCtrl.repository = injector.getRepository("user");
    }

    @ExpressServer.RequestMapping("api/users/register","post")
    async registerUser(request:Request) {
        const { username, password } = request.body;
        return await UserCtrl.repository.register(username, password);
    }

}