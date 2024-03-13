
export const colorFilter = (productArray : any, colorFilterConfig : any) => {
    const cloneProductArray = [...productArray];
    const result : any[] = []
    let idCollector : any = []
    cloneProductArray.map((product : any) => {
        const keys = Object.keys(product.productInfo) 
        keys.map((key : any) => {
            if(colorFilterConfig.includes(key)){
                if(!idCollector.includes(product.rootId)) {
                idCollector.push(product.rootId)
                result.push(product)

                }
            }
        })
    })
    return result
}

export const sizeFilter = (productsArray: any, sizeFilterConfig: any) => {
    const cloneProductArray = [...productsArray];
    let result : any = []
    let idCollector : any= []
    cloneProductArray.map((products : any) => {
        const values: any = Object.values(products.productInfo)
        values.map((value: any) => {
            value.productsDetail.map((productDetail:any) => {
                if(sizeFilterConfig.includes(productDetail.sub_attributeID)) {
                    if(!idCollector.includes(products.rootId)){
                        idCollector.push(products.rootId)
                        result.push(products)
                    }
                }
            })
        })
    })

    return result
}

export const priceFilter = (productsArray: any, priceFilterConfig: any) => {
    const cloneProductArray = [...productsArray]
    return cloneProductArray.filter((product: any) => product.valueRange.min < Number(priceFilterConfig))
}