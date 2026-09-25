import { Router } from "express";
import { validateMiddleware } from "../middleware/validate";
import {
    createMarginController,
    deleteMarginController,
    deleteMarginPermanentlyController,
    getAllMarginsController,
    getMarginByIdController,
    marginSuggestionsController,
    restoreMarginController,
    updateMarginController
} from "./margin.controller";
import { marginSchema } from "./margin.validation";

const router = Router();

router
    .post("/create", validateMiddleware(marginSchema), createMarginController)
    .get("/", getAllMarginsController)
    .get("/suggestions", marginSuggestionsController)
    .get("/:id", getMarginByIdController)
    .patch("/:id/update", validateMiddleware(marginSchema), updateMarginController)
    .patch("/:id/delete", deleteMarginController)
    .patch("/:id/restore", restoreMarginController)
    .delete("/:id/permanently", deleteMarginPermanentlyController);

export default router;
