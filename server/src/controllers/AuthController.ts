import passport from "passport";
import type { Controller } from "../../@types/express";

export const login: Controller = async (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        console.log(`${user.username} has Successfully logged in.`);

        return req.logIn(user, (err) => {
            if (err) {
                console.error(`Unexpected error: ${err.message}`);
                return res.status(500).json({ msg: "Server Error" });
            }

            return res.json({
                id_petugas: user.id_petugas,
                username: user.username,
                nama: user.nama,
                role: user.role,
                isAuthenticated: true,
            });
        });
    })(req, res, next);
};

export const logout: Controller = (req, res) => {
    req.logOut();
    return res.json({ msg: "Successfully logged out" });
};

export const getMyInfo: Controller = (req, res) => {
    return res.json(req.user);
};
