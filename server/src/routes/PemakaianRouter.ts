import { Router } from "express";
import {
    createPemakaian,
    deletePemakaian,
    getPemakaian,
    getPemakaianById,
    updatePemakaian,
} from "../controllers/PemakaianController";

const PemakaianRouter = Router();

PemakaianRouter.get("/", getPemakaian);
PemakaianRouter.get("/:id", getPemakaianById);
PemakaianRouter.post("/", createPemakaian);
PemakaianRouter.patch("/:id", updatePemakaian);
PemakaianRouter.delete("/:id", deletePemakaian);

export default PemakaianRouter;
