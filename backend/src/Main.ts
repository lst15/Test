import {Mongo} from "./configs/MongoConnect";
import {Properties} from "./configs/Properties";
import {UserCtrl} from "./controllers/UserCtrl";
import {ExpressServer} from "./controllers/ExpressServer";
import {UserFactory} from "./factories/UserFactory";
import {GameCtrl} from "./controllers/GameCtrl";
import {GameFactory} from "./factories/GameFactory";

(async () => {
    Properties.initialize()
    UserFactory.loadRepository()
    GameFactory.loadRepository()

    await Mongo.connect()

    new UserCtrl();
    new GameCtrl();
    ExpressServer.initialize()
})()