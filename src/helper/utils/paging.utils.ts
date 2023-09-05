export const pagingProcess = (data: any[], page: number, limit: number) => {
    const totalPage = Math.ceil(data.length / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const result = data.slice(start, end);
    return {
        result,
        totalPage
    }
}