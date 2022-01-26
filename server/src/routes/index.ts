import { Router } from "express";
import PetugasRouter from "./PetugasRouter";

const router = Router();
router.use("/petugas", PetugasRouter);

export default router;
