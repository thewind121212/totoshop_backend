import express from "express";
import categoriesServices from '../services/categories.services'

const getAllCategories = async (req: express.Request , res: express.Response)  => {
    const result = await categoriesServices.getAllCategories();
    res.status(200).json(result);
}

const queryCategory = async (req: express.Request , res: express.Response)  => {
    const query : any = req.query;
    const queryObject = {
        ...query,
        page: Number(query.page)? Number(query.page) : 1,
        limit: Number(query.limit)? Number(query.limit) : 20
    }
    console.log(queryObject)
    const result = await categoriesServices.queryCategory(queryObject);
    res.status(result.statusCode).json(result.data);
}


export default {
    getAllCategories,
    queryCategory
}

