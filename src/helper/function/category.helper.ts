
import { CategoryModel } from "../../api/models/category.model";
import prisma from "../db/psima.helper";
import { fetchHelperMuti } from "./product.helper";
import { composeApiTemplateForResponse } from "../../config/api/api.config";
import redisClient from "../db/redis.helper";



export  const categoryFetch = async (query: any, subCategory: any, productTree: any) => {
    let mainData = null

    const breadCrum = ['Trang Chủ']
    const data: any = await CategoryModel.findOne({ slug: query.root });
    breadCrum.push(data.name)
    let queryObject: any = []
    //query main cateogry in client
    if (data === null) {
        console.log('some thing went wrong begin query in categories.services')
        return { statusCode: 404, data: composeApiTemplateForResponse('v1.0.0', [], 'some thing went wrong', '404') };
    }
    const subCategoryFilter: any = []
    //query main must have
    if (data.mainTypeCategory === 'gender') {
        queryObject.push({ gender_id: Number(data.mainTypeId) })
        // queryObject.push({ id: { in: subCategoryFilter } })
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


    //add filter subcategory if have
    if (subCategory.length !== 0) {
        queryObject = []
        queryObject.push({ id: { in: subCategory } })
    }

    // queryObject.push({category_id: 3})
    const productsID = await prisma.categories_client_helper.findMany({
        where: {
            AND: queryObject
        }
    })

    //retrive list products detail id 
    const productsIDArray = productsID.map((item: any) => item.id);
    //query product match params on client
    const productDisplay = await prisma.product_parent.findMany({ where: { CategoryID: { in: productsIDArray } } })
    const productDetailIDArray = productDisplay.map((item: any) => item.id)
    let productDetailCategory: any = []
    const productsFetched = await fetchHelperMuti(productDetailIDArray);
    productDetailCategory = productsFetched;

    //add banner to result
    mainData = { breadCrum, products: productDetailCategory };
    //set to redis
    await redisClient.set(productTree, JSON.stringify(mainData), 'EX', 60 * 60)
    return mainData

}