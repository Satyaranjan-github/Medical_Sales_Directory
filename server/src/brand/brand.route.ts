import { Router } from "express";
import { validateMiddleware } from "../middleware/validate";
import {
    brandSuggestionsController,
    createBrandController,
    deleteBrandController,
    deleteBrandPermanentlyController,
    getAllBrandsController,
    getBrandByIdController,
    restoreBrandController,
    updateBrandController
} from "./brand.controller";
import { brandSchema } from "./brand.validation";

const router = Router()

router
    .post("/create", validateMiddleware(brandSchema), createBrandController)
    .get("/", getAllBrandsController)
    .get("/suggestions", brandSuggestionsController)
    .get("/:id", getBrandByIdController)
    .patch("/:id/update", validateMiddleware(brandSchema), updateBrandController)
    .patch("/:id/delete", deleteBrandController)
    .patch("/:id/restore", restoreBrandController)
    .delete("/:id/permanently", deleteBrandPermanentlyController)

export default router
