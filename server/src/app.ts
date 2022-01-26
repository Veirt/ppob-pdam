import express from "express";
import session from "express-session";
import passport from "passport";
import connectDatabase from "./config/typeorm";

connectDatabase().then(async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
        session({
            saveUninitialized: true,
            resave: true,
            secret: "asdjaisdkjasdlkjasdlkjsd",
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await import("./strategies/LocalStrategy");

    import("./routes").then((router) => app.use(router.default));

    app.listen(8080, () => console.log("Listening on http://localhost:8080"));
});
