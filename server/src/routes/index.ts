import { Router } from "express";
import PetugasRouter from "./PetugasRouter";
import AuthRouter from "./AuthRouter";
import PelangganRouter from "./PelangganRouter";
import GolonganRouter from "./GolonganRouter";
import RolePetugasRouter from "./RolePetugasRouter";

const router = Router();
router.use("/auth", AuthRouter);
router.use("/petugas/role", RolePetugasRouter);
router.use("/petugas", PetugasRouter);
router.use("/pelanggan", PelangganRouter);
router.use("/golongan", GolonganRouter);

export default router;
