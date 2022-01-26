import { Router } from "express";
import PetugasRouter from "./PetugasRouter";
import AuthRouter from "./AuthRouter";
import PelangganRouter from "./PelangganRouter";

const router = Router();
router.use("/auth", AuthRouter);
router.use("/petugas", PetugasRouter);
router.use("/pelanggan", PelangganRouter);

export default router;
