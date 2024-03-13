
import mongoose from "mongoose";

const { Schema, model  } = mongoose;

interface Gallery {
    idProduct: number,
    gallery: string[] | undefined,
}

const gallerySchema = new Schema<Gallery>({
    idProduct: { type: Number, required: true},
    gallery: { type: Array, required: true},
}, {timestamps: true})

export const GalleryModel = model("Gallery", gallerySchema);