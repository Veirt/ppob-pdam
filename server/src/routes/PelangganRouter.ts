import { Router } from "express";
import {
    createPelanggan,
    getPelanggan,
    getPelangganById,
} from "../controllers/PelangganController";

const PelangganRouter = Router();

PelangganRouter.get("/", getPelanggan);
PelangganRouter.get("/:id", getPelangganById);
PelangganRouter.post("/", createPelanggan);

export default PelangganRouter;
