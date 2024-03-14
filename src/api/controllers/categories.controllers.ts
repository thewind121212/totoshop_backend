import express from "express";
import categoriesServices from '../services/categories.services'
import prisma from "../../helper/db/psima.helper";
import { CategoryModel } from "../models/category.model";

const getAllCategories = async (req: express.Request , res: express.Response) => {
    const result = await categoriesServices.getAllCategories();
    res.status(200).json(result);
}

const queryCategory = async (req: express.Request , res: express.Response)  => {
    const query : any = req.query;
    // console.log(req.originalUrl)
    // let filter : any = {
    //     filterActive: true,
    //     subCategory: [],
    //     colorAttribute:[],
    //     sizeAttribute: [],
    //     priceAttribute: '0',
    // }
    // if(query.filter !== 'none') {
    //     const filterObjectForm : any = Buffer.from(query.filter, 'base64').toString('ascii')
    //     filter = filterObjectForm ? JSON.parse(filterObjectForm) : null
    //     filter.subCategory = filter.subCategory.map((item : any) => Number(item))
    // }

    const layerQuery = req.params[0].split('/');

    console.log(layerQuery)

    const categoryShouldQuery =  await categoriesServices.getAllCategories()


    const queryObject = {
        ...query,
        page: Number(query.page)? Number(query.page) : 1,
        limit: Number(query.limit)? Number(query.limit) : 40
    }
    // const result = await categoriesServices.queryCategory(queryObject);
    res.status(200).json(null);
}

// const getMixJacket = async (req: express.Request , res: express.Response) => {
//     const result = await categoriesServices.getMixJacket();
//     res.status(result.statusCode).json(result.data);
// }


const queryFullCategory = async (req: express.Request , res: express.Response) => {
    console.log(req.originalUrl)
    console.log("getFullCategory")
    const fullCategories = (await prisma.categories_client_helper.findMany()).map((item : any) => {return item.id})
    const result = await categoriesServices.queryCategory(fullCategories, "/");
    
    //query product for all category

    res.status(200).json(null);
}


export default {
    getAllCategories,
    queryCategory,
    queryFullCategory
    // getMixJacket
}

