import express from "express";
import categoriesServices from '../services/categories.services'
import prisma from "../../helper/db/psima.helper";
import { getLayerQuery } from "../../helper/function/category.helper";
import { pagingProcess } from "../../helper/utils/paging.utils";
import { sortProducts } from "../../helper/function/product-sort.helper";

const getAllCategories = async (req: express.Request, res: express.Response) => {
    const result = await categoriesServices.getAllCategories();
    res.status(200).json(result);
}


const queryFullCategory = async (req: express.Request, res: express.Response) => {

    const query: any = req.query;
    

    const fullCategories = (await prisma.categories_client_helper.findMany()).map((item: any) => { return item.id })
    const result = await categoriesServices.queryCategory(fullCategories, "/");

    const page =  Number(query.page) ? Number(query.page) : 1
    const sortBy = query.sortBy ? query.sortBy : 'default'
    if (sortBy !== 'default') {
        result.data = sortProducts(result.data, sortBy)
    }
    const itemCount = Number(query.quantity) ? Number(query.quantity) : 40
    const resultPaging = pagingProcess(result.data, page , itemCount); 
    res.status(resultPaging.statusCode).json(resultPaging.data);
}



const queryCategory = async (req: express.Request, res: express.Response) => {


    const query: any = req.query;
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
    layerQuery.map((layer: any, index: any) => {
        if (layer === "") {
            layerQuery.splice(index, 1)
        }
    })

    const { data }: any = await categoriesServices.getAllCategories()
    const categoryID = getLayerQuery(data, layerQuery)

    
    if (categoryID === null) {
        return res.status(404).json(null);  
    }

    if (categoryID !== null) {
    const result = await categoriesServices.queryCategory(categoryID, req.originalUrl );

    const page =  Number(query.page) ? Number(query.page) : 1
    const itemCount = Number(query.quantity) ? Number(query.quantity) : 40
    const resultPaging = pagingProcess(result.data, page , itemCount); 

        return res.status(resultPaging.statusCode).json(resultPaging.data);
    }



    // const result = await categoriesServices.queryCategory(queryObject);
}

// const getMixJacket = async (req: express.Request , res: express.Response) => {
//     ccategory.nameonst result = await categoriesServices.getMixJacket();
//     res.status(result.statusCode).json(result.data);
// }







export default {
    getAllCategories,
    queryCategory,
    queryFullCategory
    // getMixJacket
}

