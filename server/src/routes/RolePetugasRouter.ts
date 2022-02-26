import { Router } from "express";
import {
    createRole,
    deleteRole,
    getRole,
    getRoleById,
    updateRole,
} from "../controllers/RolePetugasController";
import { isAdmin, isAuthenticated } from "../middlewares/AuthMiddleware";

const RolePetugasRouter = Router();
RolePetugasRouter.use(isAuthenticated);
RolePetugasRouter.use(isAdmin);

RolePetugasRouter.get("/", getRole);
RolePetugasRouter.get("/:id", getRoleById);
RolePetugasRouter.post("/", createRole);
RolePetugasRouter.patch("/:id", updateRole);
RolePetugasRouter.delete("/:id", deleteRole);

export default RolePetugasRouter;
