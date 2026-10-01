import { Router } from "express";
import {
    createStockController,
    deleteStockController,
    deleteStockPermanentlyController,
    getAllStocksController,
    getStockByIdController,
    restoreStockController,
    stockSuggestionsController,
    updateStockController
} from "./stock.controller";

const router = Router();

router
    .get("/", getAllStocksController)
    .get("/suggestions", stockSuggestionsController)
    .post("/create", createStockController)
    .get("/:id", getStockByIdController)
    .patch("/:id/update", updateStockController)
    .patch("/:id/delete", deleteStockController)
    .patch("/:id/restore", restoreStockController)
    .delete("/:id/permanently", deleteStockPermanentlyController);

export default router;
