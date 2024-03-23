import { ProductItemType } from "../type"

export const sortProducts = (products: ProductItemType[], orderType: string) => {
    const cloneProductsArray = [...products]


    if (orderType === 'sortByPriceASC') {
        cloneProductsArray.sort((a: ProductItemType, b: ProductItemType) => {
            return Number(a.price) - Number(b.price)
        })
    } else if (orderType === 'sortByPriceDES') {
        cloneProductsArray.sort((a: ProductItemType, b: ProductItemType) => {
            return Number(b.price) - Number(a.price)
        })
    } else if (orderType === 'sortByLike') {
        cloneProductsArray.sort((a: ProductItemType, b: ProductItemType) => {
            return b.likes - a.likes
        })
    } else if (orderType === 'sortByNewest') {
        cloneProductsArray.sort((a: ProductItemType, b: ProductItemType) => {
            const dateA : any = new Date(a.created_at)
            const dateB : any = new Date(b.created_at)
            return dateA - dateB
        })
    }

return cloneProductsArray

}