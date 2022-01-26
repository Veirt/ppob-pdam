import { Router } from "express";
import { createPetugas, getPetugas } from "../controllers/PetugasController";

const PetugasRouter = Router();

PetugasRouter.get("/", getPetugas);
PetugasRouter.post("/", createPetugas);

export default PetugasRouter;
