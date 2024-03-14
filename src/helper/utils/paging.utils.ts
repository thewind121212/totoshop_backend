import { limitProductQuery } from "../../config/api/api.config";
import { composeApiTemplateForResponse } from "../../config/api/api.config";

export const pagingProcess = (data: any[], page: number, itemsCout: number) => {


    if (itemsCout > limitProductQuery) {
        return {
            statusCode: 413,
            data: composeApiTemplateForResponse('v1.0.0', null, 'itemsCout is over limit', '413')
        }
    }

    const totalPage = Math.ceil(data.length / itemsCout);
    const start = (page - 1) * itemsCout;
    const end = start + itemsCout;
    const result = data.slice(start, end);


    if (page > totalPage) {
        return {
            statusCode: 413,
            data: composeApiTemplateForResponse('v1.0.0', null , "you page is over total page", '413')
        }
    }


    return {
        statusCode: 200,
        data: composeApiTemplateForResponse('v1.0.0', {
            result,
            totalPage
        }, `fetch ${itemsCout} products in page ${page}/${totalPage}`, '200')
    }
}