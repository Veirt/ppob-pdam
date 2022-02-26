import { Router } from "express";
import {
    createTarif,
    deleteTarif,
    getTarif,
    getTarifById,
    updateTarif,
} from "../controllers/TarifController";
import { isAdmin, isAuthenticated } from "../middlewares/AuthMiddleware";

const TarifRouter = Router();
TarifRouter.use(isAuthenticated);

TarifRouter.get("/", getTarif);
TarifRouter.get("/:id", getTarifById);
TarifRouter.post("/", isAdmin, createTarif);
TarifRouter.patch("/:id", isAdmin, updateTarif);
TarifRouter.delete("/:id", isAdmin, deleteTarif);

export default TarifRouter;
