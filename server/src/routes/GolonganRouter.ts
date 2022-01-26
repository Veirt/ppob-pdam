import { Router } from "express";
import {
    createGolongan,
    deleteGolongan,
    getGolongan,
    getGolonganById,
    updateGolongan,
} from "../controllers/GolonganController";

const GolonganRouter = Router();

GolonganRouter.get("/", getGolongan);
GolonganRouter.get("/:id", getGolonganById);
GolonganRouter.post("/", createGolongan);
GolonganRouter.patch("/:id", updateGolongan);
GolonganRouter.delete("/:id", deleteGolongan);

export default GolonganRouter;
