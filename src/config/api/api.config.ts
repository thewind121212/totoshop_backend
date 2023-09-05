export const composeApiTemplateForResponse = (apiVer: string,data: any, errorMsg : string, errorCode : string, additionData : any = {}    ) => {
    const timestamp = new Date().toISOString();

    return {
        ...additionData,
        success: true,
        data: data,
        apiVersion: apiVer,
        error: {
            code: errorCode,
            message: errorMsg,
        },
        timestamp: timestamp
    }

}