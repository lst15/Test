import express, {Express, Request} from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
const cors = require('cors');
type methods = "get" | "post" | "put" | "delete"

export class ExpressServer {

    private static express: Express = express()
        .use(cors())
        .use(morgan(this.logRequest))
        .use(bodyParser.urlencoded({extended: false}))
        .use(bodyParser.json());

    public static initialize() {
        const PORT = 5000

        morgan.token('body', (req: Request) => {
            return JSON.stringify(req.body)
        })

        ExpressServer.express.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
            .on("error", (e) => {
                throw new Error(e.message)
            })
            .on("disconnect", (e) => {
                throw new Error(e.message)
            })

    }

    public static RequestMapping(endpoint: string, method: methods) {

        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const originalMethod = descriptor.value;

            descriptor.value = async function (req: Request) {
                return await originalMethod.call(this, req);
            };
            ExpressServer.express[method](`/${endpoint}`, async function (req, res) {
                const serviceResponse = await descriptor.value(req)

                if (serviceResponse instanceof Error) {
                    return res.status(400).send(String(serviceResponse))
                }

                return res.status(200).json(serviceResponse)
            })

        };
    }

    private static logRequest(tokens: any, req: any, res: any) {
        console.info(`[${new Date().toLocaleString("pt-BR")}] ${tokens.method(req, res)}:: ${tokens.url(req, res)} - ${tokens.status(req, res)} - ${tokens['response-time'](req, res)} 'ms'`);
        return ""
    }

}