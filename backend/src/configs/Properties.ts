import dotenv from 'dotenv';
dotenv.config();

export class Properties {
    public static mongoUri:string;

    public static initialize(){
        this.mongoUri = this.validateAndGetFieldElseThrow("MONGO_URI");
    }

    private static validateAndGetFieldElseThrow(field: string) {
        return process.env[field] || (() => {
            throw new Error(`${field} ENVIRONMENT MISSING VALUE`)
        })()
    }

}