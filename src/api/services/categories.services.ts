import { CategoryModel } from "../models/category.model"
import { composeApiTemplateForResponse } from "../../config/api/api.config";
import redisClient from "../../helper/db/redis.helper";
import redisProjectConfig from "../../config/redis/redis.config";
import { pagingProcess } from "../../helper/utils/paging.utils";
import { colorFilter, sizeFilter, priceFilter } from "../../helper/function/product-filter.helper";
import { orderProducts } from "../../helper/function/product-order.helper";
import { categoryFetch } from "../../helper/function/category.helper";
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
const queryCategory = async (query: any,) => {
    // const { subCategory, colorAttribute, sizeAttribute, priceAttribute } = filter
    //! check paramerter to return  
    if (!query.root) {
        return {
            statusCode: 404,
            data: composeApiTemplateForResponse('v1.0.0', null, 'dont have root query', '404')
        }
    }

    if (query.limit > 40) {
        return {
            statusCode: 403,
            data: composeApiTemplateForResponse('v1.0.0', null, 'limit must be less than 40', '403')
        }
    }

    //! if paremeter is ok then query
    try {

        const productTree = (`category/${query.root}${query.main ? '/' + query.main : ''}${query.sub ? '/' + query.sub : ''}`);
        let mainData: any = null
        //! retrive data from redis then set to main variable
        const dataRetrive = await redisClient.get(productTree);
        if (dataRetrive !== null && !redisProjectConfig.category.redisStatus) {
            const dataFromRedis = JSON.parse(dataRetrive);
            mainData = { breadCrum: dataFromRedis.breadCrum, products: dataFromRedis.products };
        }

        //! if not found in redis then query to db and get data set to redis and return data to main variable
        if (mainData === null) {
            // mainData = await categoryFetch(query, subCategory, productTree)
        }

        //! after retrive data from redis or db

        // // run filter color here
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



        //run pagination
        const paging = pagingProcess(mainData.products, query.page, query.limit);
        if (query.page > paging.totalPage && paging.result.length !== 0) {
            return {
                statusCode: 403,
                data: composeApiTemplateForResponse('v1.0.0', null, 'page must be less than total page', '403', { page: query.page, totalPage: paging.totalPage, limit: query.limit })
            }
        }
        //run return pagination and filter by user
        return { statusCode: 200, data: composeApiTemplateForResponse('v1.0.0', { breadCrum: mainData.breadCrum, products: paging.result }, 'null', '200', { page: query.page, totalPage: paging.totalPage, limit: query.limit, totalProducts: mainData.products.length }) };

    } catch (error) {
        //error logic here
        console.log(error)
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
