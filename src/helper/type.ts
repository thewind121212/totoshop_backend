export type ProductItemType = {
    id: number,
    name: string,
    price: number,
    likes: number,
    created_at: string,
    thumbnail: string,
    gallery: string[],
    description: string,
    breadCrum: {
        categoryQueryList: number[] | null,
        link: string,
        name: string,
        order: number
    }[],
    color: {
        [key: string]: {
            colorImage: string,
            size: {
                value: string,
                quantity: number
            }[]
        }
    },
    tags: string[],
    sold: number,
}