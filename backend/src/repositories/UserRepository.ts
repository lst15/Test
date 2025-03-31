import { UserModel } from '../models/UserModel';
import { MongoServerError } from "mongodb";
import {Properties} from "../configs/Properties";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

interface IUser {
    username: string;
    password: string;
}

export class UserRepository {

    public async login(user: IUser){
        const findOne = await UserModel.findOne({ username: user.username });
        if(!findOne) return new Error('User not found');

        const isPasswordValid = await bcrypt.compare(user.password, findOne.password);
        if(!isPasswordValid) return new Error('Invalid password');

        const token = jwt.sign({ id: findOne._id }, Properties.jwtSecret, { expiresIn: '1h' });
        return {token, userID:findOne._id}
    }

    public async register(user:IUser) {
        const model = new UserModel({ ...user });

        try {
            await model.save();
        } catch (e) {
            if(e instanceof MongoServerError) {
                switch (e.code) {
                    case 11000:
                        return new Error('Username already exists');
                    default:
                        return e;
                }
            }
        }

    }
}