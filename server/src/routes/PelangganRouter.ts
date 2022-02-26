import { Router } from "express";
import {
    createPelanggan,
    deletePelanggan,
    getPelanggan,
    getPelangganById,
    updatePelanggan,
} from "../controllers/PelangganController";
import { isAdmin, isAuthenticated } from "../middlewares/AuthMiddleware";

const PelangganRouter = Router();
PelangganRouter.use(isAuthenticated);

PelangganRouter.get("/", getPelanggan);
PelangganRouter.get("/:id", getPelangganById);
PelangganRouter.post("/", isAdmin, createPelanggan);
PelangganRouter.patch("/:id", isAdmin, updatePelanggan);
PelangganRouter.delete("/:id", isAdmin, deletePelanggan);

export default PelangganRouter;
