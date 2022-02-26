import { Router } from "express";
import {
    createGolongan,
    deleteGolongan,
    getGolongan,
    getGolonganById,
    updateGolongan,
} from "../controllers/GolonganController";
import { isAdmin, isAuthenticated } from "../middlewares/AuthMiddleware";

const GolonganRouter = Router();

GolonganRouter.use(isAuthenticated);

GolonganRouter.get("/", getGolongan);
GolonganRouter.get("/:id", getGolonganById);
GolonganRouter.post("/", isAdmin, createGolongan);
GolonganRouter.patch("/:id", isAdmin, updateGolongan);
GolonganRouter.delete("/:id", isAdmin, deleteGolongan);

export default GolonganRouter;
