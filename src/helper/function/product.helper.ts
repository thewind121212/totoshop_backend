// import prisma from "../../helper/db/psima.helper";
import redisClient from "../db/redis.helper";
import { breadCrumbBuilder } from "../utils/breadCrumb.utils";
import { ProductItemType } from '../type';
import { GalleryModel } from "../../api/models/gallery.model";
import prisma from '../db/psima.helper';



//get product detail from mysql

const getProductDetailFromMysql =  (productId: any) => {
        return  prisma.product_parent.findUnique({ where: { id: Number(productId) }, include: { product_child: { include: { attribute_define: true, product_detail: { include: { attribute_define: true } } } } } })
}
//get categoryId

const getCategoryId =  () => {

        return  prisma.categories_client_helper.findMany()
}

//get galerry from id
const getGalleryFromId = (productId: any) => {
        return  GalleryModel.findOne({ idProduct: Number(productId) })
}


//get product detail from id
const getProductDetailFromDB = async (productId: any) => {
    try {
        const [dataProductDetail, categoriesID, getGallery] = await Promise.all([getProductDetailFromMysql(productId), getCategoryId(), getGalleryFromId(productId)])
        return {
            dataProductDetail,
            categoriesID,
            getGallery
        }
    } catch (error) {
        return {
            dataProductDetail: Error,
            categoriesID: Error,
            getGallery: Error
        }
    }
}




export const getProductDetailHelper = async (productId: any) => {
    let dataRetrive: any = null
    const productDetailTree = `product/${productId}`
    //! data retrive from redis
    const dataRetriveFromRedist = await redisClient.get(productDetailTree);
    if (dataRetriveFromRedist !== null) {
        dataRetrive = await JSON.parse(dataRetriveFromRedist)
        return dataRetrive
    }

    //! data from cache not found
    if (dataRetriveFromRedist === null) {
        let data :any = null


        const { dataProductDetail, categoriesID, getGallery }: any = await getProductDetailFromDB(productId)

        if (dataProductDetail === Error || categoriesID === Error || getGallery === Error) {
            dataRetrive = null
            return dataRetrive
        }

        if (dataProductDetail === null) {
            dataRetrive = undefined
            return dataRetrive
        }

        let galleryFetched: any = getGallery

        if (galleryFetched === Error) {
            galleryFetched = {
                idProduct: Number(productId),
                gallery: []
            }
        }


        const productItem: ProductItemType = {
            id: dataProductDetail.id,
            name: dataProductDetail.name,
            price: Number(dataProductDetail.product_child[0].product_detail[0].price),
            likes: dataProductDetail.likes,
            created_at: dataProductDetail.create_date,
            thumbnail: '',
            gallery: [...galleryFetched.gallery],
            description: dataProductDetail.desc_content,
            breadCrum: [],
            color: {},
            tags: [],
            sold: 0
        }



        let sold = 0
        const color: any = {}


        const breadCrumb = breadCrumbBuilder(categoriesID, dataProductDetail)




        dataProductDetail.product_child.map((itemChild: any) => {
            const colorCode = itemChild.attribute_define.attribute_value
            color[`${colorCode}`] = {}
            color[`${colorCode}`].colorImage = itemChild.color_link,
                color[`${colorCode}`].size = []
            itemChild.product_detail.map((itemDetail: any) => {
                const sizeItem: any = {
                    value: itemDetail.attribute_define.attribute_value,
                    quantity: (itemDetail.amount - itemDetail.sold)
                }
                sold += itemDetail.sold
                color[`${colorCode}`].size.push(sizeItem)
            })
        })

        productItem.thumbnail = dataProductDetail.thumbnail_img
        productItem.color = color
        productItem.sold = sold
        productItem.breadCrum = breadCrumb


        dataRetrive = productItem


        redisClient.set(productDetailTree, JSON.stringify(dataRetrive), 'EX', 60 * 60)


        return dataRetrive

    }
}


const fetchHelper = (productId: any) => {
    return new Promise((resolve, reject) => {
        const product = getProductDetailHelper(productId);
        resolve(product)
    })
}

export const fetchHelperMuti = async (productIdArray: any) => {
    const products: any = await Promise.all(productIdArray.map((item: any) => fetchHelper(item)))
    return products
}

