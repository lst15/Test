import { UserModel } from '../models/UserModel'; // Importe o modelo já criado
import { MongoServerError } from "mongodb";

export class UserRepository {
    public async register(username: string, password: string) {
        const user = new UserModel({ username, password });
        try {
            await user.save()
        } catch (e) {
            if(e instanceof MongoServerError) {
                switch (e.code) {
                    case 11000:
                        return new Error('Username already exists');
                }
            }
        }

    }
}