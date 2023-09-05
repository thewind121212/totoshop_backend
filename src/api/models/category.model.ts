import mongoose from "mongoose";


//mongodb schema
const { Schema, model } = mongoose;

interface DetailCategory {
    name: string,
    categoryDetailId: number | string,
    slug: string,
    active: boolean,
}

interface SubCategoryItems {
    name: string,
    active: boolean,
    subCategoryId: number | string,
    slug: string,
    detailCategoryItems: DetailCategory[]
}

interface Category {
    mainTypeCategory: string,
    mainTypeId: number | string,
    subCategory: string,
    order: number | string,
    active: boolean,
    name: string,
    slug: string,
    subCategoryItems: SubCategoryItems[] | any[],
}


const categorySchema = new Schema<Category>({
    mainTypeCategory: { type: String, required: true },
    mainTypeId: { type: String, required: true },
    subCategory: { type: String, required: true },
    order: { type: Number, required: true },
    active: { type: Boolean, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    subCategoryItems: [
        {
            name: { type: String, required: true },
            active: { type: Boolean, required: true },
            subCategoryId: { type: String, required: true },
            slug: { type: String, required: true },
            detailCategoryItems: [
                {
                    name: { type: String, required: true },
                    categoryDetailId: { type: String, required: true },
                    slug: { type: String, required: true },
                    active: { type: Boolean, required: true },
                }
            ]
        }
    ]
}, { timestamps: true })


export const CategoryModel = model("Category", categorySchema);



