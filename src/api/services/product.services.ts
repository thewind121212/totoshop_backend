import { composeApiTemplateForResponse } from "../../config/api/api.config";
import prisma from "../../helper/db/psima.helper";
import { ImageModel } from '../models/image.model';
import redisClient from "../../helper/db/redis.helper";


const getProductDetail = async (productId: string | null | number) => {
    //run if productId is null then rerturn 404
    if (productId === null) {
        return {
            statusCode: 404,
            data: composeApiTemplateForResponse('v1.0.0', null, 'dont have product Id', '404')
        }
    }
    //run logic after check productId have or not
    let dataRetrive: any = null
    const productDetailTree = `product/${productId}`
    //! data retrive from redis
    const dataRetriveFromRedist = await redisClient.get(productDetailTree);
    if(dataRetriveFromRedist !== null) {
        dataRetrive = JSON.parse(dataRetriveFromRedist)
    }
    //! data collection process if redis not have
    //run if productId have
    if (dataRetriveFromRedist === null) {
        const productDetailData: any = {}
        const imageData: any = await ImageModel.findOne({ productId: productId });
        if (imageData === null) {
            return {
                statusCode: 404,
                data: composeApiTemplateForResponse('v1.0.0', null, 'invalid product Id', '404')
            }
        }
        console.log(imageData)
        productDetailData.rootId = imageData.productId
        productDetailData.thumbnail = imageData.thumbnail
        productDetailData.gallery = imageData.gallery
        const productChilren = await prisma.product_child.findMany({
            include: {
                attribute_define: true,
            }
            ,
            where: { product_parentID: Number(productId) }
        })

        console.log(productChilren)

        //run checking color is matched ?
        const colorFromImageStorage = (Object.keys(imageData.color))
        //run if color match the build color from image storage
        const productInfo: any = {}
        const valueRange = {
            min: 0,
            max: 0,
        }
        for (let i = 0; i < productChilren.length; i++) {
            const item: any = productChilren[i]
            const colorCode = item.attribute_define.attribute_value
            if (colorFromImageStorage.includes(colorCode)) {
                //run code get product detail
                const detailProducts = await prisma.product_detail.findMany({ include: { attribute_define: true }, where: { product_childID: item.id } })
                //run code get min max price
                detailProducts.forEach((item: any) => {
                    if (i === 0) {
                        valueRange.min = item.price
                        valueRange.max = item.price
                    }
                    else if (item.price < valueRange.min) {
                        valueRange.min = item.price
                    }
                    else if (item.price > valueRange.max) {
                        valueRange.max = item.price
                    }
                })
                //run code set product full infomation
                productInfo[colorCode] = {
                    colorId: item.attribute_define.id,
                    colorImage: imageData.color[colorCode],
                    productsDetail: detailProducts
                }
            }
        }

        productDetailData.productInfo = productInfo
        productDetailData.valueRange = valueRange
        productDetailData.sale = null
        dataRetrive = productDetailData
        redisClient.set(productDetailTree, JSON.stringify(productDetailData), 'EX', 60 * 60)
    }
    //! data write to redis
    if(dataRetrive === null) return console.log('something went wrong in code source')
    return {
        statusCode: 200,
        data: composeApiTemplateForResponse('v1.0.0', dataRetrive, 'success', '200')
    }


}


export default {
    getProductDetail
}