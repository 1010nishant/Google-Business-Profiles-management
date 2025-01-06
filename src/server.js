import app from "./app.js";
import configuration from './config/configuration.js';
import { connectDB } from "./db/index.js";

const config = configuration();

connectDB()
    .then(() => {
        app.listen(config.SERVER.PORT || 5001, () => {
            console.log(`🔥🔥 Server is running at port : ${config.SERVER.PORT} 🔥🔥`);
        })
    })
    .catch((err) => {
        console.log("Neon db connection failed !!! ", err);
    })