import { Router } from "express";
import {
    createRole,
    deleteRole,
    getRole,
    getRoleById,
    updateRole,
} from "../controllers/RolePetugasController";

const RolePetugasRouter = Router();

RolePetugasRouter.get("/", getRole);
RolePetugasRouter.get("/:id", getRoleById);
RolePetugasRouter.post("/", createRole);
RolePetugasRouter.patch("/:id", updateRole);
RolePetugasRouter.delete("/:id", deleteRole);

export default RolePetugasRouter;
