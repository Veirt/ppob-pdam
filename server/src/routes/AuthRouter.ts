import { Router } from "express";
import { login } from "../controllers/AuthController";

const AuthRouter = Router();

AuthRouter.post("/login", login);

export default AuthRouter;
