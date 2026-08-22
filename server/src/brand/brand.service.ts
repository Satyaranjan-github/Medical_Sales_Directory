import type { IBrand } from "../types/brand";
import { Brand } from "./brand.model";

export const createBrand = async (brandData: IBrand) => {
    return await Brand.create(brandData);
}

export const getAllBrands = async () => {
    return await Brand.find();
}

export const getBrandById = async (id: string) => {
    return await Brand.findById(id);
}

export const updateBrand = async (id: string, brandData: Partial<IBrand>) => {
    return await
        Brand.findByIdAndUpdate(id,
            brandData, { new: true }
        );
}

export const deleteBrand = async (id: string) => {
    const brand = await Brand.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true });

    if (!brand) {
        throw new Error("Brand not found");
    }

    return brand;
}

export const restoreBrand = async (id: string) => {
    const brand = await Brand.findById(id);

    if (!brand) {
        throw new Error("Brand not found");
    }

    await Brand.findByIdAndUpdate(id, {
        isDeleted: false,
        deletedAt: null
    }, { new: true });
}

export const deleteBrandPermanently = async (id: string) => {
    const brand = await Brand.findById(id);

    if (!brand) {
        throw new Error("Brand not found");
    }

    return await Brand.findByIdAndDelete(id);
}

export const brandSuggestions = async (query: string) => {
    return await Brand.find({
        name: { $regex: query, $options: "i" },
        isDeleted: false
    }).select("_id name");
}