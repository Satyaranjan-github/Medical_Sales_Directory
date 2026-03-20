import { Router } from "express";
import { validateMiddleware } from "../middleware/validate";
import { createCategoryController, deleteCategoryController, getAllCategorysController, getCategoryByIdController, restoreCategoryController, updateCategoryController } from "./category.controller";
import { categorySchema } from "./category.validation";

const router = Router()

router
    .post("/create", validateMiddleware(categorySchema), createCategoryController)
    .get("/", getAllCategorysController)
    .get("/:id", getCategoryByIdController)
    .patch("/:id/update", validateMiddleware(categorySchema), updateCategoryController)
    .patch("/:id/delete", deleteCategoryController)
    .patch("/:id/restore", restoreCategoryController)
    .delete("/:id/permanently", deleteCategoryController)


export default router
