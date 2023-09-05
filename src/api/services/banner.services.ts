
import { BannersModel } from "../models/banner.model"
import { composeApiTemplateForResponse } from "../../config/api/api.config";

const getAllBannerService = async () => {
    const result = await BannersModel.find();
    return composeApiTemplateForResponse('v1.0.0', result, 'null', 'null');
}

export default {
    getAllBannerService
}