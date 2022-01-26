import { Router } from "express";
import {
    createTarif,
    deleteTarif,
    getTarif,
    getTarifById,
    updateTarif,
} from "../controllers/TarifController";

const TarifRouter = Router();

TarifRouter.get("/", getTarif);
TarifRouter.get("/:id", getTarifById);
TarifRouter.post("/", createTarif);
TarifRouter.patch("/:id", updateTarif);
TarifRouter.delete("/:id", deleteTarif);

export default TarifRouter;
