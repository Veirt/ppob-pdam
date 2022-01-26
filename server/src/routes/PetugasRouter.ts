import { Router } from "express";
import {
    createPetugas,
    deletePetugas,
    getPetugas,
    getPetugasById,
    updatePetugas,
} from "../controllers/PetugasController";

const PetugasRouter = Router();

PetugasRouter.get("/", getPetugas);
PetugasRouter.get("/:id", getPetugasById);
PetugasRouter.post("/", createPetugas);
PetugasRouter.patch("/:id", updatePetugas);
PetugasRouter.delete("/:id", deletePetugas);

export default PetugasRouter;
