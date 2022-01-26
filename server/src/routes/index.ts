import { Router } from "express";
import AuthRouter from "./AuthRouter";
import GolonganRouter from "./GolonganRouter";
import PelangganRouter from "./PelangganRouter";
import PemakaianRouter from "./PemakaianRouter";
import PetugasRouter from "./PetugasRouter";
import RolePetugasRouter from "./RolePetugasRouter";

const router = Router();
router.use("/auth", AuthRouter);
router.use("/petugas/role", RolePetugasRouter);
router.use("/petugas", PetugasRouter);
router.use("/pelanggan/pemakaian", PemakaianRouter);
router.use("/pelanggan/golongan", GolonganRouter);
router.use("/pelanggan", PelangganRouter);

export default router;
