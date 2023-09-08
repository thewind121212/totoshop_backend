import mongoose from "mongoose";

const { Schema, model  } = mongoose;

interface Image {
    productId: number,
    thumbnail: string,
    color: any | undefined,
    gallery: any[] | undefined,
    imageType: string 
}

const imagesSchema = new Schema<Image>({
    productId: { type: Number, required: true},
    thumbnail: { type: String, required: true},
    color: { type: Object, required: true},
    gallery: { type: Array, required: true},
}, {timestamps: true})

export const ImageModel = model("Image", imagesSchema);