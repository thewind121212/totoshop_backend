export const orderProducts = (products: any, orderType: string) => {
    const cloneProductsArray = [...products]
    console.log(typeof (products[0].createDate))


    if (orderType === 'orderByPriceASC') {
        cloneProductsArray.sort((a: any, b: any) => {
            return Number(a.valueRange.min) - Number(b.valueRange.min)
        })
    } else if (orderType === 'orderByPriceDES') {
        cloneProductsArray.sort((a: any, b: any) => {
            return Number(b.valueRange.min) - Number(a.valueRange.min)
        })
    } else if (orderType === 'orderByLike') {
        cloneProductsArray.sort((a: any, b: any) => {
            return b.like - a.like
        })
    } else if (orderType === 'orderByNewest') {
        cloneProductsArray.sort((a: any, b: any) => {
            const dateA : any = new Date(a.createDate)
            const dateB : any = new Date(b.createDate)
            return dateA - dateB
        })
    }

return cloneProductsArray

}