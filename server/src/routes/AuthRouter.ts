import { Router } from "express";
import { getMyInfo, login, logout } from "../controllers/AuthController";
import { isAuthenticated } from "../middlewares/AuthMiddleware";

const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.post("/logout", isAuthenticated, logout);
AuthRouter.get("/@me", isAuthenticated, getMyInfo);

export default AuthRouter;
