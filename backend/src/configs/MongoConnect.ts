import {Properties} from "./Properties";
const mongoose = require('mongoose');

export class Mongo {

    public static async connect() {
        await mongoose.connect(Properties.mongoUri, { // Updated here
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }
}
