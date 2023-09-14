import express from 'express';
import productServices from '../services/product.services';

const getProductDetail = async (req: express.Request, res: express.Response) => {
    console.log(req.query)
    const productId  : string | null = req.query.productId ? req.query.productId.toString() : null;
    const result : any = await productServices.getProductDetail(productId);
    res.status(result.statusCode).json(result.data);
}

export default {
    getProductDetail
}