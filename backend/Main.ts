import {Mongo} from "./src/configs/MongoConnect";
import {Properties} from "./src/configs/Properties";
import {UserCtrl} from "./src/controllers/UserCtrl";
import {ExpressServer} from "./src/controllers/ExpressServer";
import {UserFactory} from "./src/factories/UserFactory";

(async () => {
    Properties.initialize()
    UserFactory.loadRepository()

    await Mongo.connect()

    new UserCtrl();
    ExpressServer.initialize()
})()