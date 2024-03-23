import { CategoryModel } from "../models/category.model"
import { composeApiTemplateForResponse } from "../../config/api/api.config";
import redisClient from "../../helper/db/redis.helper";
import redisProjectConfig from "../../config/redis/redis.config";
import { getProductsByCategory } from "../../helper/function/category.helper";
import { JacketMixModel } from "../models/jacketMix.model";

const getAllCategories = async () => {
    const dataRetrive = await redisClient.get('categories');
    //find and retrive
    if (dataRetrive !== null && redisProjectConfig.categories.redisStatus) {
        return composeApiTemplateForResponse('v1.0.0', JSON.parse(dataRetrive), 'null', 'null');
    }
    else {
        const data = await CategoryModel.find();
        await redisClient.set('categories', JSON.stringify(data), 'EX', 60 * 60 * 24)
        return composeApiTemplateForResponse('v1.0.0', data, 'null', 'null');
    }
    //retrive from redis

}


//query Category
const queryCategory = async (query: number[], layerQuery : string) => {

    //! check paramerter to return  


    //! if paremeter is ok then query
    try {
        let mainData: any = undefined

        const allProducts : any = []
        const products: any = await Promise.all(query.map(async(item: any) => getProductsByCategory(item)))

        products.map((item: any) => {
            allProducts.push(...item)
        }).sort()        


        //set to redis
        await redisClient.set(layerQuery, JSON.stringify(allProducts), 'EX', 60 * 60 * 24)

        return { statusCode: 200, data: allProducts };

        // console.log(products.length)


        //! after retrive data from redis or db

        // //run filter color here
        // if (colorAttribute.length !== 0) {
        //     mainData.products = colorFilter(mainData.products, colorAttribute)
        // }
        // //run filter size
        // if (sizeAttribute.length !== 0) {
        //      mainData.products = sizeFilter(mainData.products, sizeAttribute)
        // }

        // //run filter price 
        // if(priceAttribute !== '0' ) {
        //    mainData.products =  priceFilter(mainData.products, priceAttribute)
        // }

        // //run function helper order here
        // if(query.order !== 'default') {
        //     mainData.products =  orderProducts(mainData.products, query.order)
        // }



        // //run pagination
        // const paging = pagingProcess(mainData.products, query.page, query.limit);
        // if (query.page > paging.totalPage && paging.result.length !== 0) {
        //     return {
        //         statusCode: 403,
        //         data: composeApiTemplateForResponse('v1.0.0', null, 'page must be less than total page', '403', { page: query.page, totalPage: paging.totalPage, limit: query.limit })
        //     }
        // }
        //run return pagination and filter by user
        // return { statusCode: 200, data: composeApiTemplateForResponse('v1.0.0', { breadCrum: mainData.breadCrum, products: paging.result }, 'null', '200', { page: query.page, totalPage: paging.totalPage, limit: query.limit, totalProducts: mainData.products.length }) };

    } catch (error) {
        //error logic here
        console.log('some thing went fuking wrong in categories.services.ts')
        return { statusCode: 404, data: composeApiTemplateForResponse('v1.0.0', [], 'some thing went wrong', '404') };
    }
}

//get mix jacket for store
const getMixJacket = async() => {
    const data =  await JacketMixModel.find()
    return {statusCode: 200, data: composeApiTemplateForResponse('v1.0.0', data, 'null', '200')}
}

export default {
    getAllCategories,
    queryCategory,
    getMixJacket
}
