import { Router } from "express";
import {
    createTagihan,
    deleteTagihan,
    getTagihan,
    getTagihanById,
    updateTagihan,
} from "../controllers/TagihanController";

const TagihanRouter = Router();

TagihanRouter.get("/", getTagihan);
TagihanRouter.get("/:id", getTagihanById);
TagihanRouter.post("/", createTagihan);
TagihanRouter.patch("/:id", updateTagihan);
TagihanRouter.delete("/:id", deleteTagihan);

export default TagihanRouter;
