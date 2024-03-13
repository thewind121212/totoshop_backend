import {Request, Response} from 'express';
import attributeServices from '../services/attribute.services';


const getAllAttributesController = async (req: Request, res: Response) => {
    console.log(req.originalUrl)
    console.log('123123')
    const result : any = await attributeServices.getAllAttributesServices()
    res.status(result.statusCode).json(result.data);
} 

export default {
    getAllAttributesController
}



