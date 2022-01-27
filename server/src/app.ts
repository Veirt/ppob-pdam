import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import connectDatabase from "./config/typeorm";

dotenv.config();

connectDatabase().then(async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
        session({
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

    app.listen(8080, () => console.log("Listening on http://localhost:8080"));
});
