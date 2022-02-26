import { Router } from "express";
import {
    createPembayaran,
    deletePembayaran,
    getPembayaran,
    getPembayaranById,
    updatePembayaran,
} from "../controllers/PembayaranController";
import { isAuthenticated, isPetugasLoket } from "../middlewares/AuthMiddleware";

const PembayaranRouter = Router();
PembayaranRouter.use(isAuthenticated);
PembayaranRouter.use(isPetugasLoket);

PembayaranRouter.get("/", getPembayaran);
PembayaranRouter.get("/:id", getPembayaranById);
PembayaranRouter.post("/", createPembayaran);
PembayaranRouter.patch("/:id", updatePembayaran);
PembayaranRouter.delete("/:id", deletePembayaran);

export default PembayaranRouter;
