import { Router } from "express";
import {
    createPetugas,
    deletePetugas,
    getPetugas,
    getPetugasById,
    updatePetugas,
} from "../controllers/PetugasController";
import { isAdmin, isAuthenticated } from "../middlewares/AuthMiddleware";

const PetugasRouter = Router();
PetugasRouter.use(isAuthenticated);
PetugasRouter.use(isAdmin);

PetugasRouter.get("/", getPetugas);
PetugasRouter.get("/:id", getPetugasById);
PetugasRouter.post("/", createPetugas);
PetugasRouter.patch("/:id", updatePetugas);
PetugasRouter.delete("/:id", deletePetugas);

export default PetugasRouter;
