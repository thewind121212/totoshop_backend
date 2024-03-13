import express from 'express';
import productServices from '../services/product.services';
import { composeApiTemplateForResponse } from "../../config/api/api.config";

const getProductDetail = async (req: express.Request, res: express.Response) => {
    const productId  : string | null = req.query.productId ? req.query.productId.toString() : null;
    if (!productId) {
        res.status(400).json(composeApiTemplateForResponse('v1.0.0', null, 'dont have product Id', '400'));
        return;
    }
    const result : any = await productServices.getProductDetail(productId);
    res.status(200).json(result.data);
}

export default {
    getProductDetail
}