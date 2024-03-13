import { composeApiTemplateForResponse } from "../../config/api/api.config";
import { getProductDetailHelper } from "../../helper/function/product.helper";


const getProductDetail = async (productId: string | null | number) => {
    //run if productId is null then rerturn 404
    if (productId === null) {
        return {
            statusCode: 404,
            data: composeApiTemplateForResponse('v1.0.0', null, 'dont have product Id', '404')
        }
    }
    //run logic after check productId have or not

    const dataRetrive = await getProductDetailHelper(productId);

    if (dataRetrive === null) {
        console.log('something went wrong in product.services.ts')
        return {
            statusCode: 500,
            data: composeApiTemplateForResponse('v1.0.0', "Server Internal Error Cant Get Product Item", 'serverError', '500')
        }
    }

    if (dataRetrive === undefined) {
        return {
            statusCode: 404,
            data: composeApiTemplateForResponse('v1.0.0', null, 'Product Not Found', '404')
        }
    }


    return {
        statusCode: 200,
        data: composeApiTemplateForResponse('v1.0.0', dataRetrive, 'success', '200')
    }


}


export default {
    getProductDetail
}