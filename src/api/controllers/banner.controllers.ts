import { Request, Response } from "express";
import bannerServices from "../services/banner.services";

const getAllBannerController = async (req: Request, res: Response) => {
    const result = await bannerServices.getAllBannerService();
    res.status(200).json(result);
}

export default {
    getAllBannerController
}