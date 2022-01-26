import { Router } from "express";
import {
    createPetugas,
    getPetugas,
    getPetugasById,
} from "../controllers/PetugasController";

const PetugasRouter = Router();

PetugasRouter.get("/", getPetugas);
PetugasRouter.get("/:id", getPetugasById);
PetugasRouter.post("/", createPetugas);

export default PetugasRouter;
