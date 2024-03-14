export const composeApiTemplateForResponse = (apiVer: string,data: any, errorMsg : string, errorCode : string, additionData : any = {}    ) => {
    const timestamp = new Date().toISOString();

    return {
        ...additionData,
        data: data,
        apiVersion: apiVer,
        error: {
            code: errorCode,
            message: errorMsg,
        },
        timestamp: timestamp
    }

}


export const limitProductQuery = 40