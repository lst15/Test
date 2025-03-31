import {UserRepository} from "../repositories/UserRepository";
import {injector} from "./Injector";

export class UserFactory {
    static loadRepository()  {
        const repository = new UserRepository();
        injector.registerRepository("user", repository);
    }
}