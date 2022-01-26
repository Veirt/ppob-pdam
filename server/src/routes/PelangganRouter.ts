import { Router } from "express";
import {
    createPelanggan,
    deletePelanggan,
    getPelanggan,
    getPelangganById,
    updatePelanggan,
} from "../controllers/PelangganController";

const PelangganRouter = Router();

PelangganRouter.get("/", getPelanggan);
PelangganRouter.get("/:id", getPelangganById);
PelangganRouter.post("/", createPelanggan);
PelangganRouter.patch("/:id", updatePelanggan);
PelangganRouter.delete("/:id", deletePelanggan);

export default PelangganRouter;
