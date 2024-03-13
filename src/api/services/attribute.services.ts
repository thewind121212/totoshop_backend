import { composeApiTemplateForResponse } from "../../config/api/api.config"
import prisma from "../../helper/db/psima.helper";
import redisClient from "../../helper/db/redis.helper";
import redisProjectConfig from "../../config/redis/redis.config";


const getAllAttributesServices = async () => {
    //run get attribute from sql 
    try {
        let result: any = null
        //run get attribute from redis
        result = await redisClient.get('attributes');

        if (result === null || redisProjectConfig.attributes) {
           const dataRetrive = await prisma.attribute_define.findMany(
                { include: { attribute_storage: true } }
            );

            let attributeCollector: any = {}
            dataRetrive.map((item: any) => {
                const objectKey = item.attribute_storage.name_attribute
                if (attributeCollector[objectKey] === undefined) {
                    attributeCollector[objectKey] = []
                    attributeCollector[objectKey].push(item)
                }
                else {
                    attributeCollector[objectKey].push(item)
                }
            })

            result = attributeCollector
            await redisClient.set('attributes', JSON.stringify(result), 'EX', 60 * 60 * 24)
        }



        return {
            statusCode: 200,
            data: composeApiTemplateForResponse('v1.0.0', result, 'null', 'null')
        } 
        
    } catch (error) {
        console.log('something went wrong in attributes servrice', error)
    }
}

export default {
    getAllAttributesServices
}