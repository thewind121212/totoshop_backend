import { composeApiTemplateForResponse } from "../../config/api/api.config";
import prisma from "../../helper/db/psima.helper";
import { ImageModel } from '../models/image.model';


const getProductDetail = async (productId: string | null) => {
    //run if productId is null then rerturn 404
    if (productId === null) {
        return {
            statusCode: 404,
            data: composeApiTemplateForResponse('v1.0.0', null, 'dont have product Id', '404')
        }
    }
    //! data collection process
    //run if productId have
    const productDetailData : any = {}  
    const imageData: any = await ImageModel.findOne({ productId: 542 });
    productDetailData.rootId = imageData.productId
    productDetailData.thumbnail = imageData.thumbnail
    productDetailData.gallery = imageData.gallery
    const productChilren = await prisma.product_child.findMany({
        include: {
            attribute_define: true,
        }
        ,
        where: { product_parentID: 542 }
    })


    //run checking color is matched ?
    const colorFromImageStorage = (Object.keys(imageData.color))
    //run if color match the build color from image storage
    const productInfo : any = {}
    const valueRange = {
        min: 0,
        max: 0,
    }
    for (let i = 0; i < productChilren.length; i++) {
        const item : any = productChilren[i]
        const colorCode = item.attribute_define.attribute_value
        if (colorFromImageStorage.includes(colorCode)) {
            //run code get product detail
            const detailProducts = await prisma.product_detail.findMany({include: {attribute_define: true},where: {product_childID: item.id}}) 
            //run code get min max price
            if (i === 0 ) {
                valueRange.min = item.price
                valueRange.max = item.price
            } 
            else if (item.price < valueRange.min) {
                valueRange.min = item.price
            }
            else if (item.price > valueRange.max) {
                valueRange.max = item.price
            }
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
    console.log(productDetailData)




}


export default {
    getProductDetail
}