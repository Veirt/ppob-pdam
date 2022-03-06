import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import connectDatabase from "./config/typeorm";

import Redis from "ioredis";
import connectRedis from "connect-redis";

dotenv.config();

connectDatabase().then(async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ credentials: true, origin: process.env.CLIENT_ENDPOINT }));

    const RedisStore = connectRedis(session); //Configure redis client
    const redisClient = new Redis(process.env.REDIS_URL || undefined);

    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            saveUninitialized: true,
            resave: true,
            secret: process.env.SESSION_SECRET!,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await import("./strategies/LocalStrategy");

    import("./routes").then((router) => app.use(router.default));

    // handle uncaught error
    process.on("uncaughtException", (err) => {
        console.error(`Unexpected error: ${err}`);
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
});
