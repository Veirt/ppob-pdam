import { Router } from "express";
import { getPetugas } from "../controllers/PetugasController";

const PetugasRouter = Router();

PetugasRouter.get("/", getPetugas);

export default PetugasRouter;
