
import prisma from "../db/psima.helper";
import { fetchHelperMuti } from "./product.helper";
import redisClient from "../db/redis.helper";


export const getProductsByCategory = async (categoryID: number) => {

    const retriveRedis = await redisClient.get(`category-${categoryID}`);

    if (retriveRedis !== null) {
        const retriveProductID = JSON.parse(retriveRedis)
        const productData = await fetchHelperMuti(retriveProductID)
        return productData
    }

    if (retriveRedis === null) {
        const productsID = (await prisma.product_parent.findMany({ where: { CategoryID: categoryID }, select: { id: true } })).map((item: any) => item.id)


        const productData = await fetchHelperMuti(productsID)


        await redisClient.set(`category-${categoryID}`, JSON.stringify(productsID), 'EX', 60 * 60 * 5)

        return productData

    }


}


export const getLayerQuery = (categories : any[],layerQuery: any[]) => {
    let categoryID: any = []
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].slug === layerQuery[0]) {

            if (layerQuery.length === 1) {
                categoryID = [...categories[i].queryList]
                i = categories.length
            }

            if (layerQuery.length === 2 || layerQuery.length === 3) {
                categories[i].subCategoryItems.map((item: any) => {
                    if (item.slug === layerQuery[1]) {
                        categoryID = [...item.queryList]
                        if (layerQuery.length === 3) {
                             categoryID = null
                            item.detailCategoryItems.map((itemSub: any) => {
                                if (itemSub.slug === layerQuery[2]) {
                                    categoryID = [...itemSub.queryList]
                                }                                
                            })
                        }
                        i = categories.length
                    }
                })
            }


        } else {
            categoryID = null
        }
    }

    return categoryID
}