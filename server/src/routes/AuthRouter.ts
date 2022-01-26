import { Router } from "express";
import { getMyInfo, login } from "../controllers/AuthController";
import { isAuthenticated } from "../middlewares/AuthMiddleware";

const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.get("/@me", isAuthenticated, getMyInfo);

export default AuthRouter;
