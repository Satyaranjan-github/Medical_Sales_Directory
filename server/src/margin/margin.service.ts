import type { IMargin } from "../types/margin";
import { Margin } from "./margin.model";

export const createMargin = async (marginData: IMargin) => {
    return await Margin.create(marginData);
};

export const getAllMargins = async (page?: number, limit?: number) => {
    if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const [margins, total] = await Promise.all([
            Margin.find().skip(skip).limit(limit),
            Margin.countDocuments()
        ]);
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            margins,
            total,
            page,
            limit,
            totalPages
        };
    }

    const margins = await Margin.find();
    const total = margins.length;
    return {
        margins,
        total,
        page: 1,
        limit: total,
        totalPages: 1
    };
};

export const getMarginById = async (id: string) => {
    return await Margin.findById(id);
};

export const updateMargin = async (id: string, marginData: Partial<IMargin>) => {
    return await Margin.findByIdAndUpdate(id, marginData, { new: true });
};

export const deleteMargin = async (id: string) => {
    const margin = await Margin.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true });

    if (!margin) {
        throw new Error("Margin not found");
    }

    return margin;
};

export const restoreMargin = async (id: string) => {
    const margin = await Margin.findById(id);

    if (!margin) {
        throw new Error("Margin not found");
    }

    return await Margin.findByIdAndUpdate(id, {
        isDeleted: false,
        deletedAt: null
    }, { new: true });
};

export const deleteMarginPermanently = async (id: string) => {
    const margin = await Margin.findById(id);

    if (!margin) {
        throw new Error("Margin not found");
    }

    return await Margin.findByIdAndDelete(id);
};

export const marginSuggestions = async (query: string) => {
    return await Margin.find({
        title: { $regex: query, $options: "i" },
        isDeleted: false
    }).select("_id title value");
};
