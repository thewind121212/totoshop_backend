import { CategoryModel } from "../models/category.model"
import { composeApiTemplateForResponse } from "../../config/api/api.config";
import redisClient from "../../helper/db/redis.helper";
import redisProjectConfig from "../../config/redis/redis.config";
import prisma from "../../helper/db/psima.helper";
import { pagingProcess } from "../../helper/utils/paging.utils";

const getAllCategories = async () => {
    const dataRetrive = await redisClient.get('categories');
    //find and retrive
    if (dataRetrive !== null && !redisProjectConfig.categories.redisStatus) {
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
const queryCategory = async (query: any) => {
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
            data: composeApiTemplateForResponse('v1.0.0', null, 'limit must be less than 21', '403')
        }
    }

    //! if paremeter is ok then query
    try {
        
        const productTree = (`category/${query.root}${query.main ? '/' + query.main : ''}${query.sub ? '/' + query.sub : ''}`);
        let mainData: any = null
        //! retrive data from redis then set to main variable
        const dataRetrive = await redisClient.get(productTree);
        if (dataRetrive !== null && redisProjectConfig.category.redisStatus) {
             const dataFromRedis = JSON.parse(dataRetrive);
             mainData = {breadCrum: dataFromRedis.breadCrum, products: dataFromRedis.products};
        }

        //! if not found in redis then query to db and get data set to redis and return data to main variable
        if (mainData === null) {
            const breadCrum = ['Trang Chủ']
            const data : any = await CategoryModel.findOne({ slug: query.root });
                breadCrum.push(data.name)
            let queryObject: any = []
            //query main cateogry in client
            if (data === null) {
                console.log('some thing went wrong begin query')
                return { statusCode: 404, data: composeApiTemplateForResponse('v1.0.0', [], 'some thing went wrong', '404') };
            }
            //query main must have
            if (data.mainTypeCategory === 'gender') {
                queryObject.push({ gender_id: Number(data.mainTypeId) })
            } else {
                queryObject.push({ category_id: Number(data.mainTypeId) })
            }
            

            //query sub and detail if have 
            if (query.main !== 'none') {
                const subProducts = data.subCategoryItems.find((item: any) => item.slug === query.main);
                breadCrum.push(subProducts.name)
                queryObject.push({ [`${data.mainTypeCategory === 'gender' ? 'category_id' : 'gender_id'}`]: Number(subProducts.subCategoryId) })
                if (query.sub !== 'none') {
                    const detailProducts = subProducts.detailCategoryItems.find((item: any) => item.slug === query.sub)
                    breadCrum.push(detailProducts.name)
                    queryObject = []
                    queryObject.push({
                        id: Number(detailProducts.categoryDetailId)
                    })
                }
            }

            const productsID = await prisma.categories_client_helper.findMany({
                where: {
                    AND: queryObject
                }
            })

            //retrive list products detail id 
            const productsIDArray = productsID.map((item: any) => item.id);
            //query product match params on client
            const productDisplay = await prisma.product_parent.findMany({ where: { CategoryID: { in: productsIDArray } } })
            //add banner to result
            mainData = {breadCrum, products: productDisplay};
            //set to redis
            await redisClient.set(productTree, JSON.stringify(mainData), 'EX', 60 * 60)

        }

        //! after retrive data from redis or db

        //run pagination
        const paging = pagingProcess(mainData.products, query.page, query.limit);
        if (query.page > paging.totalPage && paging.result.length !== 0) {
            return {
                statusCode: 403,
                data: composeApiTemplateForResponse('v1.0.0', null, 'page must be less than total page', '403', { page: query.page, totalPage: paging.totalPage, limit: query.limit })
            }
        }
        //run return pagination
        return { statusCode: 200, data: composeApiTemplateForResponse('v1.0.0', {breadCrum: mainData.breadCrum, products: paging.result}, 'null', '200', { page: query.page, totalPage: paging.totalPage, limit: query.limit, totalProducts: mainData.products.length }) };

    } catch (error) {
        //error logic here
        console.log('some thing went fuking wrong bro inside query')
        return { statusCode: 404, data: composeApiTemplateForResponse('v1.0.0', [], 'some thing went wrong', '404') };
    }
}

export default {
    getAllCategories,
    queryCategory
}

