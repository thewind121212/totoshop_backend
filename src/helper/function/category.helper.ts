
import { CategoryModel } from "../../api/models/category.model";
import prisma from "../db/psima.helper";
import { fetchHelperMuti } from "./product.helper";
import { composeApiTemplateForResponse } from "../../config/api/api.config";
import redisClient from "../db/redis.helper";


export const getProductsByCategory = async (categoryID: number) => {

    // const dataRetrive = await redisClient.get(`category-${categoryID}`);
    // if (dataRetrive !== null) {
    //     return dataRetrive
    // }

    const productsID = (await prisma.product_parent.findMany({where: {CategoryID: 48}, select: {id: true}})).map((item: any) => item.id)

    //fetch products 

    const productData = await fetchHelperMuti(productsID)

    console.log("productsID", productData)

    //cache data

    // await redisClient.set(`category-${categoryID}`, JSON.stringify(productData), 'EX', 60 * 60 * 24)

}