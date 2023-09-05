import { Request, Response, NextFunction } from 'express';

//checking request iq and log request to db 
const checkAndLogRequest = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.ip)
    // console.log('it middleware',res)
    next(); 
}

export default checkAndLogRequest;