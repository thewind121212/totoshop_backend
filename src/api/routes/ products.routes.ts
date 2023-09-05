import { Router } from "express";


const route = Router();

route.get('/', (req, res) => {
    console.log('123')
})   

export default route;