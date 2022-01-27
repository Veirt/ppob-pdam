import { Router } from "express";
import AuthRouter from "./AuthRouter";
import GolonganRouter from "./GolonganRouter";
import PelangganRouter from "./PelangganRouter";
import PemakaianRouter from "./PemakaianRouter";
import PetugasRouter from "./PetugasRouter";
import RolePetugasRouter from "./RolePetugasRouter";
import TagihanRouter from "./TagihanRouter";
import TarifRouter from "./TarifRouter";

const router = Router();
router.use("/auth", AuthRouter);
router.use("/petugas/role", RolePetugasRouter);
router.use("/petugas", PetugasRouter);
router.use("/pelanggan/pemakaian", PemakaianRouter);
router.use("/pelanggan", PelangganRouter);
router.use("/golongan/tarif", TarifRouter);
router.use("/golongan", GolonganRouter);
router.use("/tagihan", TagihanRouter);

export default router;
