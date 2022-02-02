import { Router } from "express";
import {
    createPembayaran,
    deletePembayaran,
    getPembayaran,
    getPembayaranById,
    updatePembayaran,
} from "../controllers/PembayaranController";

const PembayaranRouter = Router();

PembayaranRouter.get("/", getPembayaran);
PembayaranRouter.get("/:id", getPembayaranById);
PembayaranRouter.post("/", createPembayaran);
PembayaranRouter.patch("/:id", updatePembayaran);
PembayaranRouter.delete("/:id", deletePembayaran);

export default PembayaranRouter;
