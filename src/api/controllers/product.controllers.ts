import express from 'express';
import productServices from '../services/product.services';

const getProductDetail =  (req: express.Request, res: express.Response) => {
    console.log(req.query)
    const productId  : string | null = req.query.productId ? req.query.productId.toString() : null;
    const result : any = productServices.getProductDetail(productId);
    // res.status(result?.statusCode).json(result?.data)
    res.status(200).json(req.query.productId);
}

export default {
    getProductDetail
}