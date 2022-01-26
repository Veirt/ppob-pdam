import passport from "passport";
import { Controller } from "../../@types/controller";

export const login: Controller = async (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        console.log(`${user.username} berhasil login`);

        return req.logIn(user, (err) => {
            if (err) {
                console.error(`Unexpected error: ${err.message}`);
                return res.status(500).json({ msg: "Server Error" });
            }

            return res.json({
                id_petugas: user.id_petugas,
                username: user.username,
                role: user.role,
            });
        });
    })(req, res, next);
};
