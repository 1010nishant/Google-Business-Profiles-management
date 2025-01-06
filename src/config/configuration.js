// TODO - pick everything from here, in all the modules
import dotenv from 'dotenv'

dotenv.config();
export default () => ({
    SERVER: {
        PORT: process.env.PORT,
        MONGODB_URI: process.env.MONGODB_URI,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD
    },
    SECRET_KEY: {
        OPEN_AI: process.env.OPENAI_API_KEY
    },
    DATABASE: {
        NAME: process.env.DB_NAME,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        HOST: process.env.DB_HOST,
        REDIS_URI: process.env.REDIS_URI
    },
    ENV: {
        NODE_ENV: process.env.NODE_ENV,
    },
    JWT: {
        JWT_SECRET: process.env.JWT_SECRET
    },
});