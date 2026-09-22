import { Router } from "express";
import { validateMiddleware } from "../middleware/validate";
import {
    createSaleController,
    deleteSaleController,
    deleteSalePermanentlyController,
    getAllSalesController,
    getSaleByIdController,
    getSalesByMedicineController,
    restoreSaleController,
    updateSaleController
} from "./sale.controller";
import { createSaleSchema, updateSaleSchema } from "./sale.validation";

const router = Router();

router
    .post("/create", validateMiddleware(createSaleSchema), createSaleController)
    .get("/", getAllSalesController)
    .get("/medicine/:medicineId", getSalesByMedicineController)
    .get("/:id", getSaleByIdController)
    .patch("/:id/update", validateMiddleware(updateSaleSchema), updateSaleController)
    .patch("/:id/delete", deleteSaleController)
    .patch("/:id/restore", restoreSaleController)
    .delete("/:id/permanently", deleteSalePermanentlyController);

export default router;