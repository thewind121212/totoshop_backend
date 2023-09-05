
import mongoose from "mongoose";

const { Schema, model  } = mongoose;

interface Banner {
    name: string,
    slug: string,
    img_link: any | undefined,
}

const bannersSchema = new Schema<Banner>({
    name: { type: String, required: true},
    slug: { type: String, required: true},
    img_link: { type: Object, required: true},
}, {timestamps: true})

export const BannersModel = model("Banners", bannersSchema );