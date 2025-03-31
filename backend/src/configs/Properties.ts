import dotenv from 'dotenv';
dotenv.config();

export class Properties {
    public static mongoUri:string;
    public static jwtSecret:string;

    public static initialize(){
        this.mongoUri = this.validateAndGetFieldElseThrow("MONGO_URI");
        this.jwtSecret = this.validateAndGetFieldElseThrow("JWT_SECRET");
    }

    private static validateAndGetFieldElseThrow(field: string) {
        return process.env[field] || (() => {
            throw new Error(`${field} ENVIRONMENT MISSING VALUE`)
        })()
    }

}