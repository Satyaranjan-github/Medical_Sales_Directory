import { Router } from "express";
import { validateMiddleware } from "../middleware/validate";
import {
    createMedicineController,
    deleteMedicineController,
    getAllMedicinesController,
    getMedicineByIdController,
    medicineSuggestionsController,
    restoreMedicineController,
    updateMedicineController
} from "./medicine.controller";
import { medicineSchema } from "./medicine.validation";

const router = Router()

router
    .post("/create", validateMiddleware(medicineSchema), createMedicineController)
    .get("/", getAllMedicinesController)
    .get("/suggestions", medicineSuggestionsController)
    .get("/:id", getMedicineByIdController)
    .patch("/:id/update", validateMiddleware(medicineSchema), updateMedicineController)
    .patch("/:id/delete", deleteMedicineController)
    .patch("/:id/restore", restoreMedicineController)
    .delete("/:id/permanently", deleteMedicineController)

export default router
