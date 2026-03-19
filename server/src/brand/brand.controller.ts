import type { Request, Response } from "express";
import { createBrand, deleteBrand, deleteBrandPermanently, getAllBrands, getBrandById, restoreBrand, updateBrand } from "./brand.service";

export const createBrandController = async (req: Request, res: Response) => {
    const brandData = req.body;
    const newBrand = await createBrand(brandData)

    res.status(201).json({
        message: "Brand created successfully",
        data: newBrand,
        success: true
    });
}

export const getAllBrandsController = async (req: Request, res: Response) => {
    const brands = await getAllBrands();

    res.status(200).json({
        message: "Brands Fetched successfully",
        data: brands,
        success: true
    });
}

export const getBrandByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const brand = await getBrandById(id as string);

    res.status(200).json({
        message: "Brand Fetched Successfully",
        data: brand,
        success: true
    });
}

export const updateBrandController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const brandData = req.body;

    const updatedBrand = await updateBrand(id as string, brandData);

    res.status(200).json({
        message: "Brand Updated Successfully",
        data: updatedBrand,
        success: true
    });
}

export const deleteBrandController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedBrand = await deleteBrand(id as string);

    res.status(200).json({
        message: "Brand Deleted Successfully",
        data: deletedBrand,
        success: true
    });
}

export const restoreBrandController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const restoredBrand = await restoreBrand(id as string);

    res.status(200).json({
        message: "Brand Restored Successfully",
        data: restoredBrand,
        success: true
    });
}

export const deleteBrandPermanentlyController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedBrand = await deleteBrandPermanently(id as string);

    res.status(200).json({
        message: "Brand Permanently Deleted Successfully",
        data: deletedBrand,
        success: true
    });
}