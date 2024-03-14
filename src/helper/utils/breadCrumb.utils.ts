
import {removeDiacritics } from "./string.utils";


export const breadCrumbBuilder = (categoriesID : any, dataProductDetail : any) => {

        const rootCategoryExclude = [1]

        const { name,category_id, gender_id, gender , category_name }: any = categoriesID.find((item: any) => item.id === dataProductDetail.CategoryID)

        const breadCrum: any = [
            {
                categoryQueryList: null,
                link: '/',
                name: 'Trang Chủ',
                order: 1
            }
        ]

        if (rootCategoryExclude.includes(category_id)) {
            const rootQuery: any = []
            const subQuery: any = []
            const rootName: any = category_name
            const rootLink = removeDiacritics(rootName.trim())
            const subName: any = null
            const subLink = removeDiacritics(gender.trim())
            categoriesID.map((item: any) => {
                if (rootCategoryExclude.includes(item.category_id)) {
                    rootQuery.push(item.id)
                    if(item.gender_id === gender_id){
                        subQuery.push(item.id)
                    }
                }
            })


            breadCrum.push(
                {
                categoryQueryList:rootQuery ,
                link: '/' + rootLink.trim(),
                name: rootName,
                order: 2
                },{
                categoryQueryList: subQuery ,
                link: '/' + rootLink.trim() + '/' + rootLink +  "-" + subLink,
                name: subName,
                order: 3
                },{
                categoryQueryList: [dataProductDetail.CategoryID] ,
                link: '/' + rootLink + '/' + removeDiacritics(name.trim()) + "-" + subLink,
                name: name + " " + gender.toLowerCase(),
                order: 4
                }
            )


        }
        else {
            const rootQuery: any = []
            const rootLink = removeDiacritics(gender.trim())
            const subQuery: any = []
            const subName: any = category_name
            const subLink = removeDiacritics(category_name.trim())
            categoriesID.map((item: any) => {
                if (item.gender_id === gender_id && !rootCategoryExclude.includes(item.category_id)) {
                    rootQuery.push(item.id)
                    if(item.category_id === category_id){
                        subQuery.push(item.id)
                    }
                }
            })
            breadCrum.push(
                {
                categoryQueryList:rootQuery ,
                link: '/' + rootLink.trim(),
                name: gender,
                order: 2
                },{
                categoryQueryList: subQuery ,
                link: '/' + rootLink + '/' + subLink +  "-" + rootLink,
                name: subName,
                order: 3
                },{
                categoryQueryList: [dataProductDetail.CategoryID] ,
                link: '/' + rootLink + '/' + removeDiacritics(name.trim()) + "-" + rootLink,
                name: name + " " + gender.toLowerCase(),
                order: 4
                }
            )
        }

        return breadCrum
}