import {Mongo} from "./src/configs/MongoConnect";
import {Properties} from "./src/configs/Properties";
import {UserCtrl} from "./src/controllers/UserCtrl";
import {ExpressServer} from "./src/controllers/ExpressServer";
import {UserFactory} from "./src/factories/UserFactory";
import {GameCtrl} from "./src/controllers/GameCtrl";
import {GameFactory} from "./src/factories/GameFactory";

(async () => {
    Properties.initialize()
    UserFactory.loadRepository()
    GameFactory.loadRepository()

    await Mongo.connect()

    new UserCtrl();
    new GameCtrl();
    ExpressServer.initialize()
})()