import { Middleware } from "../../@types/express";

export const isAuthenticated: Middleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: "Not authenticated" });
    }
    return next();
};

export const isAdmin: Middleware = (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });

    if (req.user.role.id_role !== 3) {
        return res.status(401).json({ msg: "Not authorized" });
    }

    return next();
};
