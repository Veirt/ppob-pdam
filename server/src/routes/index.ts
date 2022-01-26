import { Router } from "express";
import PetugasRouter from "./PetugasRouter";
import AuthRouter from "./AuthRouter";

const router = Router();
router.use("/petugas", PetugasRouter);
router.use("/auth", AuthRouter);

export default router;
