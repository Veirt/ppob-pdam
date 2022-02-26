import { Router } from "express";
import {
    createPemakaian,
    deletePemakaian,
    getPemakaian,
    getPemakaianById,
    getPeriodePemakaian,
    updatePemakaian,
} from "../controllers/PemakaianController";
import { isAuthenticated, isPetugasMeteran } from "../middlewares/AuthMiddleware";

const PemakaianRouter = Router();
PemakaianRouter.use(isAuthenticated);

PemakaianRouter.get("/", getPemakaian);
PemakaianRouter.get("/periode", getPeriodePemakaian);
PemakaianRouter.get("/:id", getPemakaianById);
PemakaianRouter.post("/", isPetugasMeteran, createPemakaian);
PemakaianRouter.patch("/:id", updatePemakaian);
PemakaianRouter.delete("/:id", isPetugasMeteran, deletePemakaian);

export default PemakaianRouter;
