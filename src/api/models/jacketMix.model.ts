import mongoose from "mongoose";

const jacketMixSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    code: { type: String },
    name: { type: String },
    importPrice: { type: String },
    price: { type: String },
    thumbnail: { type: String },
    description: { type: String },
    showMix: { type: Boolean },
    addDate: { type: String },
    gallery: { type: Array },
    detail: { type: Object },
}, { timestamps: true });

export const JacketMixModel = mongoose.model("JacketMix", jacketMixSchema);